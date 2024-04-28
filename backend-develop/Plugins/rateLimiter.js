'use strict';


const Redis = require('redis');


const Bluebird = require('bluebird');
const createBoomError = require('create-boom-error');

Bluebird.promisifyAll(Redis.RedisClient.prototype);
Bluebird.promisifyAll(Redis.Multi.prototype);

const RedisClient = Redis.createClient({
    port: '6379',
    host: 'localhost'
})


const defaultRate = {
    limit: 2,
    window: 1
};


exports.register = function(server, options, next) {

    server.register({
            register: require('hapi-rate-limiter'),
            options: {

                defaultRate: (request) => defaultRate,
                redisClient: RedisClient,
                rateLimitKey: (request) => request.info.remoteAddress ,
                overLimitError: createBoomError('RateLimitExceeded', 429, (rate) => `Rate limit exceeded. Please wait ${rate.window} seconds and try your request again.`)
            }
        },
        function(err) {
            if (err) {
            	console.log(err);
                throw err;
            }
        });

    next();
};

exports.register.attributes = {
    name: 'rate-limiter'
};
