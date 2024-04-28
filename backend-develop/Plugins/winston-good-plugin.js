// import winston from 'winston';
// import goodWinston from 'hapi-good-winston';


const winston = require('winston');
const goodWinston = require('hapi-good-winston').goodWinston;


// Set winston minimum log level to debug
winston.level = 'debug';

 // Only the 'response' and 'error' event levels will be overwritten
const goodWinstonOptions = {
    levels: {
        response: 'debug',
        error: 'info',
    }
};


const options = {
    reporters: {
        // Simple and straight forward usage
        winston: [goodWinston(winston)],

        // Adding some customization configuration
        winstonWithLogLevels: [goodWinston(winston, goodWinstonOptions)],

        // This example simply illustrates auto loading and instantiation made by good
        winston2: [{
            module: 'hapi-good-winston',
            name: 'goodWinston',
            args: [winston, goodWinstonOptions],
        }],
    },
};


const plugin = {

  name: 'winston-good-plugin',

  register : function(server, options) {

  //Register Authorization Plugin

  (async () => {

    await server.register({ plugin : require('good') ,
      options : options


  })



  })();

}
}

module.exports = plugin

