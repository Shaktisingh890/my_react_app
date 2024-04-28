var Controller = require('../Controllers');
var UniversalFunctions = require('../Utils/UniversalFunctions');
var Joi = require('joi');


function handleControllerResponse(err, data, statusMessage) {


    if (!this.request.auth.isAuthenticated) {
        return this.reply('Authentication failed due to: ' + this.request.auth.error.message);
    }

    console.log(err, data, statusMessage);


    if (err == 1) {
        this.reply(UniversalFunctions.sendSuccess(statusMessage, data)).code(statusMessage.statusCode);
    } else {
        if (err) {
            this.reply(UniversalFunctions.sendError(err));
        } else {
            this.reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(201)
        }
    }

}

exports.handleControllerResponse = handleControllerResponse;



function handleControllerResponsePromise(context, fn, data) {


    // if (!this.request.auth.isAuthenticated) {
    //   return this.reply('Authentication failed due to: ' + this.request.auth.error.message);
    // }

    // console.log(err, data, statusMessage);


    // if(err == 1) {
    //   this.reply(UniversalFunctions.sendSuccess(statusMessage, data)).code(statusMessage.statusCode);
    // } else {
    //   if (err) {
    //     this.reply(UniversalFunctions.sendError(err));
    //   } else {
    //     this.reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(201)
    //   }
    // }



    return new Promise(resolve => {

        fn.call(context, data, (err, data, statusMsg, extraData) => {


            if (this.request && this.request.auth && !this.request.auth.isAuthenticated) {
              console.log(this.request.auth)
                resolve(this.request.auth.error.message);
            } else {

                if (err == 1) {
                    resolve(UniversalFunctions.sendSuccess(statusMessage, data, extraData));
                } else {

                    if (err) {
                        resolve(UniversalFunctions.sendError(err));
                    } else {
                        resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data, extraData))
                    }

                }
            }
        });





    });
}

exports.handleControllerResponsePromise = handleControllerResponsePromise;


function handleControllerResponseWithoutAuth(err, data, statusMessage) {
    if (err) {
        this.reply(UniversalFunctions.sendError(err));
    } else {
        this.reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(201)
    }
}

exports.handleControllerResponseWithoutAuth = handleControllerResponseWithoutAuth;



function handleControllerResponseWithoutAuthPromise(context, fn, data) {


    return new Promise(resolve => {

        fn.call(context, data, (err, data, statusMsg) => {

            if (err) {
                resolve(UniversalFunctions.sendError(err));
            } else {
                resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data))
            }



        });
    });

}



exports.handleControllerResponseWithoutAuthPromise = handleControllerResponseWithoutAuthPromise;



exports.handleControllerResponseWithoutAuth = handleControllerResponseWithoutAuth;


function getUserData(request, reply){

    return request.auth && request.auth.credentials && request.auth.credentials.userData;

}

exports.getUserData = getUserData;


function getAdminData(request, reply) {


    console.log(request.auth.credentials)

    return request.auth && request.auth.credentials && request.auth.credentials.adminData;

}

exports.getAdminData = getAdminData;


function handlePromise(promise) {

    return new Promise(function (resolve, reject) {

        promise.then(function (result) {
            resolve(sendResponse(null, result));
        }).catch(function (err) {
            resolve(sendResponse(err, null));
        });

    });



}

exports.handlePromise = handlePromise;

function sendResponse(err , result){

    console.log(err , result)
    if(err){
        return UniversalFunctions.sendError(err)
    }else{
       return UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, result)
    }
}

exports.sendResponse = sendResponse;

exports.sendResponsePromise = async function(promise){


    var err , result;


try {

   const y = await promise



   result = y;

} catch(e){

    console.error(e)
    err = e;
}




return sendResponse(err , result)
}



function handleControllerResponsePost(err, data, statusMessage) {

    console.log(err, data, statusMessage);

    // if (!this.request.auth.isAuthenticated) {

    //   return this.reply('Authentication failed due to: ' + this.request.auth.error.message);
    // }
    if (err) {
        this.reply(UniversalFunctions.sendError(err));
    } else {
        this.reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data)).code(200)
    }
}
exports.handleControllerResponsePost = handleControllerResponsePost;


function handleControllerResponseForFile(err, filePath, fileName) {


    if (!this.request.auth.isAuthenticated) {
        return this.reply('Authentication failed due to: ' + this.request.auth.error.message);
    }

    console.log(err, filePath, fileName);

    if (err) {
        this.reply(UniversalFunctions.sendError(err));
    } else {

        var fs = require('fs');

        var fileToSend = fs.readFileSync(filePath);

        var name = 'attachment; filename=' + fileName + ';';

        console.log(' dailyReport RESPONSE: ', filePath, fileName);

        this.reply(fileToSend)
            .bytes(fileToSend.length)
            .type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            .header('content-disposition', fileName);

    }

}
exports.handleControllerResponseForFile = handleControllerResponseForFile;



var routesPlugin = {
    //'hapiAuthorization': {roles: ['SUPER_DUPER_ADMIN', 'SUPER_ADMIN']},
    'hapi-swagger': {
        // payloadType: 'form',
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
    },

};



exports.routesPlugin = routesPlugin;
