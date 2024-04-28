'use strict';

global.__basedir = __dirname;
//External Dependencies
const Hapi = require('@hapi/hapi');
const Handlebars = require('handlebars');
const Qs = require('qs');

// require('dotenv').config()
require('dotenv').config({ path: 'local.env' });

console.log("ENVIRONMENT : ", process.env.NODE_ENV);

//Internal Dependencies

const Plugins = require('./Plugins');
const Bootstrap = require('./Utils/BootStrap');
const config = require('config');

//Create Server
const server = new Hapi.Server({
    port: config.get('HAPI_PORT'),
    routes: {
        cors: {
            credentials: false,
            origin: 'ignore',
            headers: ['Authorization', 'Content-Type', 'If-None-Match']
        }
    },
    query: {
        parser: query => Qs.parse(query),
      }
});

//Register All Plugins

const provision = async () => {

    //console.log(Plugins)


    const options = {
        ops: {
            interval: 1000
        },
        reporters: {
            myConsoleReporter: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*' }]
            }, {
                module: 'good-console'
            }, 'stdout'],
            // myFileReporter: [{
            //     module: 'good-squeeze',
            //     name: 'Squeeze',
            //     args: [{ ops: '*' }]
            // }, {
            //     module: 'good-squeeze',
            //     name: 'SafeJson'
            // }, {
            //     module: 'good-file',
            //     args: ['./test/fixtures/awesome_log']
            // }],
            // myHTTPReporter: [{
            //     module: 'good-squeeze',
            //     name: 'Squeeze',
            //     args: [{ error: '*' }]
            // }, {
            //     module: 'good-http',
            //     args: ['http://prod.logs:3000', {
            //         wreck: {
            //             headers: { 'x-api-key': 12345 }
            //         }
            //     }]
            // }]
        }
    };


    await server.register({
        plugin: require('good'),
        options,
    });


    await server.register(Plugins);

    await server.register(require('@hapi/vision'));

    await server.views({
        engines: { html: Handlebars },
        relativeTo: __dirname,
        path: 'Views'
    });




    var Routes = require('./Routes');

    // //API Routes
    await server.route(Routes);
    //Default Routes
    await server.route({
        method: 'GET',
        path: '/',
        handler: function(req, res) {
            //TODO Change for production server
            return res.view('index')
        }
    });

    // server.route(
    //     {
    //         method: 'OPTIONS',
    //         path: '/',
    //         handler: function (req, res) {
    //             //TODO Change for production server
    //             return res.view('index')
    //         }
    //     }
    // );


    await server.start();

    console.log('Server running at:', server.info.uri);

}


provision();


// Connect To Socket.io
// Bootstrap.connectSocket(server);

// Bootstrap Admin data
Bootstrap.bootstrapAdmin(function(err, message) {
    if (err) {
        // console.log('Error while bootstrapping version : ' + err)
    } else {
        // console.log(message);
    }
});