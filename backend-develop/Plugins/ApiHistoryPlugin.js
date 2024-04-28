'use strict';

var Services = require("./../Services");

var winston = require('winston');

var request = require('request');

const getIpLocation = function(ip, next) {

    request('http://ip-api.com/json/' + ip, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // Show the HTML for the Google homepage. 

            var fnlObject = {};
            if (body.status == "success") {
                fnlObject.address = body.as + " , " + body.city + " , " + body.country + " (" + body.countryCode + "), " + body.timezone + " , " + body.zip + " , " + body.regionName;
                fnlObject.loc = [body.lat, body.lon]

            } else {
                fnlObject.address = "may be local"
                fnlObject.loc = [0, 0]
            }

            next(null, fnlObject)
        } else {
            var fnlObject = {};
            fnlObject.address = "may be local"
            fnlObject.loc = [0, 0]
            next(null, fnlObject)
        }
    })

    // return next(null, Number(a) + Number(b));
};

// http://ip-api.com/json/208.80.152.201

exports.register = function(server, options, next) {

    // const ipCache = server.cache({
    //     cache: 'redisCache',
    //     expiresIn: 20 * 1000,
    //     segment: 'customSegment',
    //     generateFunc: function (id, next) {

    //         getIpLocation(id.ip, next);
    //     },
    //     generateTimeout: 10000
    // });


    server.ext('onRequest', function(request, reply) {

        // console.log("==================onPreHandler request.method ==================", request.url);

        return reply.continue();

    });

    server.ext('onPreHandler', function(request, reply) {
        var userType = "Users";

        var requestData = {
            payload: request.payload,
            query: request.query
        }
        console.log("==================onPreHandler request.method ==================", requestData, request.method, request.url.pathname);

        return reply.continue();

    });

    server.ext('onPreResponse', function(request, reply) {

        // console.log("in on onPreResponseonPreResponseonPreResponseonPreResponseonPreResponseonPreResponse")

        if (request.method.toUpperCase() == 'OPTIONS') {
            return reply.continue();
        }

        var response;

        response = request.response;


        var responseData;
        if (response.isBoom == true) {
            responseData = {
                statusCode: response.output.payload.statusCode,
                error: response.output.payload.error,
                responseType: response.output.payload.responseType,
                message: response.output.payload.message
            }
        } else {
            responseData = {

                statusCode: response.source.statusCode,
                message: response.source.message

            }
        }

        if (response && response.output && response.output.payload) {

            if (response.output.payload.statusCode == 500)
                winston.error('500 ERROR OCCURED :  ', response);
            else if (response.output.payload.statusCode == 400)
                winston.error('400 ERROR OCCURED :  ', responseData);
            else if (response.output.payload.error)
                winston.error(' ERROR OCCURED :  ', responseData);
        }


        // console.log(responseData);
        // var userType = "Users";
        // var requestData = {
        //     payload: request.payload,
        //     query: request.query
        // }

        return reply.continue();
    });
    next();
};


exports.register.attributes = {
    name: 'ApiHistoryPlugin',
    version: '1.0.0'
};
