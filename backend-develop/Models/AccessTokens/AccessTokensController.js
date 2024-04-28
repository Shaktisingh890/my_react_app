var Service = require('../../Services');
var Models = require('../../Models');
var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var controllerHelper = require('../../Controllers/commonControllerFunctions');
var Config = require('../../constant');


function startSection(sectionName) {

    console.log('=====================' + sectionName + '===================')
}


function AccessTokensController(service) {

    ControllerModule.call(this, service);
}

AccessTokensController.prototype = Object.create(ControllerModule.prototype)

/**
 * @param  {
 *
 *    token , userId
 *    
 * 
 * 
 * }
 * @param  {Function}
 * @return {[type]}
 */
AccessTokensController.prototype.validateAccessToken = function(data, callback) {

    if (!data.accessToken) {
        console.trace();
        return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
    }

    var criteria = {
        accessToken: data.accessToken,
        userId: data.userId,
        loginAs: data.loginAs,
        population: "userId"

    }
    var projection = {

    }
    var options = {
        lean: true

    }

    this.service.view(criteria, projection, options, function(err, res) {

        if (err) {
            return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR);
        }

        if (res.length) {

            data.userData = res[0].userId;
            delete res.userId
            data.userData.accessTokenDetails = res[0]

            updateUsersLastSeen(data.userData._id);

            return callback(null, data.userData);


        } else {

            return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN);

        }


    })

}

function updateUsersLastSeen(userId) {
    
    Service.makeModule.users.edit({_id: userId}, {lastOnlineAt: new Date()}, {}, (err, res) => {
        if(err)
            console.log("updateUsersLastSeen==err==>", err)
    })

}


AccessTokensController.prototype.createNewAccessToken = function(data, callback) {

    if (!data.accessTokenSave || !data.accessTokenSave.userId || !data.accessTokenSave.accessToken) {
        console.trace();
        return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
    }

    this.service.add(data.accessTokenSave, function(err, result) {
        if (err) {

         console.log('************** ERROR **************** createNewAccessToken **************** :',data.accessTokenSave.accessToken,data.accessTokenSave);

            return callback(err);
        }
        data.accessTokenData = result;

        Service.makeModule.users.view({ _id: data.accessTokenSave.userId }, {}, { lean: true }, function(err, result) {

            if (err) return callback(err);

            if (result.length) {

                data.userData = result[0];
                data.userData.accessTokenDetails = data.accessTokenData
                return callback(null, data)
            }
        })
    })
}

/**
 * @param  {
 *
 *    token , userId
 *    
 * 
 * 
 * }
 * @param  {Function}
 * @return {[type]}
 */
AccessTokensController.prototype.deleteAccessToken = function(criteria, callback) {

    this.service.remove(criteria, function(err, res) {

        if (err) {
            return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR);
        }

        return callback(null, res);

    })
}






module.exports = {
    'accessTokens': new AccessTokensController(Service.makeModule.accessTokens)

};;
