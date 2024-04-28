'use strict';

//Register Swagger
var pack = require('../package');
// swaggerOptions = {
//   apiVersion: pack.version,
//   pathPrefixSize: 2

// };

const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');

const HapiSwagger = require('hapi-swagger');



// var swaggerOptions = {
//     pathPrefixSize: 2

// };

function register(server, options) {

    (async () => {

        // await server.register([Inert, Vision, {
        //         plugin: require('hapi-swaggered'),
        //         options: {
        //             tagging: {
        //                 // mode : "tags",
        //                 pathLevel: 2
        //             },
        //             tags: {
        //                 'foobar/test': 'Example foobar description'
        //             },
        //             info: {
        //                 title: 'Expanter Api Doc',
        //                 description: 'Powered by Charpixel Technologies',
        //                 version: '1.0'
        //             }
        //         }
        //     }, {
        //         plugin: require('hapi-swaggered-ui'),
        //         options: {
        //             title: 'Expanter API',
        //             path: '/documentation',
        //             authorization: {
        //                 field: 'authorization',
        //                 scope: 'header', // header works as well
        //                 valuePrefix: 'bearer ', // prefix incase
        //                 // defaultValue: 'demoKey',
        //                 placeholder: 'Enter your apiKey here'
        //             },
        //             defaultTags: ["api"],
        //             // auth : 'UserAuth',
        //             swaggerOptions: {
        //                 validatorUrl: null
        //             }
        //         }
        //     }


        // ]);

        const swaggerOptions = {
            info: {
                title: 'Expanter API Documentation',
                version: pack.version,
            },
            security: [{ bearerAuth: [] }],
            securityDefinitions: {
                bearerAuth: {
                    field: 'authorization',
                    type: 'apiKey',
                    name: 'authorization',
                    scheme: 'bearer',
                    in: 'header',
                },
            },
        };

        await server.register([
            Inert,
            Vision,
            {
                plugin: HapiSwagger,
                options: swaggerOptions
            }
        ]);

        try {

        } catch (err) {
            console.log(err);
        }


    })();

}


module.exports = {
    name: 'swagger-plugin',
    register: register
};