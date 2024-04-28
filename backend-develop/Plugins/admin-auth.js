'use strict';
var TokenManager = require('../Lib/TokenManager');
var UniversalFunctions = require('../Utils/UniversalFunctions');

exports.register = function(server, options, next) {

  //Register Authorization Plugin
  server.register(require('hapi-auth-bearer-token'), function(err) {
    server.auth.strategy('AdminAuth', 'bearer-access-token', {
      allowQueryToken: false,
      allowMultipleHeaders: true,
      accessTokenName: 'accessToken',
      validateFunc: function(token, callback) {
        TokenManager.verifyTokenAdmin(token, function(err, response) {
          if (err || !response || !response.adminData) {
            callback(null, false, {
              token: token,
              adminData: null
            })
          } else {



            callback(null, true, {
              token: token,
              adminData: response.adminData
            })
          }
        });

      }
    });

  });

  next();
};

exports.register.attributes = {
  name: 'admin-auth-token-plugin'
};
