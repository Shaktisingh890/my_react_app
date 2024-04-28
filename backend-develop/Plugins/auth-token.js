'use strict';

var TokenManager = require('../Lib/TokenManager');
var UniversalFunctions = require('../Utils/UniversalFunctions');

const plugin = {

    name: 'auth-token-plugin',

    register: function(server, options) {

        //Register Authorization Plugin

        (async () => {

            await server.register(require('hapi-auth-bearer-token'))

            server.auth.strategy('UserAuth', 'bearer-access-token', {
                allowQueryToken: false,
                allowMultipleHeaders: true,
                accessTokenName: 'accessToken',
                validate: async (request, token, h) => {

                    return new Promise((resolve) => {

                        TokenManager.verifyToken(token, function(err, response) {

                            console.log("auth plugin===>", err, response)
                            if (err || !response || !response.userData) {

                                const isValid = false;

                                const credentials = {
                                    token: token,
                                    userData: null
                                };
                                const artifacts = {
                                    test: 'info'
                                };

                                resolve({
                                    isValid,
                                    credentials,
                                    credentials
                                });
                            } else {
                                delete response.adminData;


                                const isValid = true;

                                const credentials = {
                                    token: token,
                                    userData: response.userData
                                };
                                const artifacts = {
                                    test: 'info'
                                };

                                resolve({
                                    isValid,
                                    credentials,
                                    credentials
                                });
                            }
                        });

                    });


                }
            });

            server.auth.strategy('BrandAuth', 'bearer-access-token', {
                allowQueryToken: false,
                allowMultipleHeaders: true,
                accessTokenName: 'accessToken',
                validate: async (request, token, h) => {

                    return new Promise((resolve) => {

                        TokenManager.verifyToken(token, function(err, response) {

                            console.log("auth plugin===>", err, response)
                            if (err || !response || !response.userData || response.userData.userRole != UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE_KEYS.userRole.brand) {

                                const isValid = false;

                                const credentials = {
                                    token: token,
                                    userData: null
                                };
                                const artifacts = {
                                    test: 'info'
                                };

                                resolve({
                                    isValid,
                                    credentials,
                                    credentials
                                });
                            } else {

                                delete response.adminData;


                                const isValid = true;

                                const credentials = {
                                    token: token,
                                    userData: response.userData
                                };
                                const artifacts = {
                                    test: 'info'
                                };

                                resolve({
                                    isValid,
                                    credentials,
                                    credentials
                                });
                            }
                        });

                    });


                }
            });

            server.auth.strategy('ServiceProviderAuth', 'bearer-access-token', {
                allowQueryToken: false,
                allowMultipleHeaders: true,
                accessTokenName: 'accessToken',
                validate: async (request, token, h) => {

                    return new Promise((resolve) => {

                        TokenManager.verifyToken(token, function(err, response) {

                            console.log("auth plugin===>", err, response)
                            if (err || !response || !response.userData || response.userData.userRole != UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE_KEYS.userRole.serviceProvider) {

                                const isValid = false;

                                const credentials = {
                                    token: token,
                                    userData: null
                                };
                                const artifacts = {
                                    test: 'info'
                                };

                                resolve({
                                    isValid,
                                    credentials,
                                    credentials
                                });
                            } else {

                                delete response.adminData;


                                const isValid = true;

                                const credentials = {
                                    token: token,
                                    userData: response.userData
                                };
                                const artifacts = {
                                    test: 'info'
                                };

                                resolve({
                                    isValid,
                                    credentials,
                                    credentials
                                });
                            }
                        });

                    });


                }
            });

            server.auth.strategy('AdminAuth', 'bearer-access-token', {
                allowQueryToken: false,
                allowMultipleHeaders: true,
                accessTokenName: 'accessToken',
                validate: async (request, token, h) => {

                    return new Promise((resolve) => {

                        TokenManager.verifyTokenAdmin(token, function(err, response) {

                            if (err || !response || !response.adminData) {

                                const isValid = false;

                                const credentials = {
                                    token: token,
                                    adminData: null
                                };
                                const artifacts = {
                                    test: 'info'
                                };

                                resolve({
                                    isValid,
                                    credentials,
                                    credentials
                                });

                            } else {

                                delete response.userData;


                                const isValid = true;

                                const credentials = {
                                    token: token,
                                    adminData: response.adminData
                                };
                                const artifacts = {
                                    test: 'info'
                                };

                                resolve({
                                    isValid,
                                    credentials,
                                    credentials
                                });

                            }

                        });

                    });

                }
            });

        })();

    }
}

module.exports = plugin