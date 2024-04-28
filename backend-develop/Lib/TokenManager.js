'use strict';

const Config = require('../constant');
const Jwt = require('jsonwebtoken');
const async = require('async');
const Service = require('../Services');
const Controllers = require('../Controllers');
const config = require('config');



function CheckIfControllerNotInitialised() {

    if (!Controllers || !Controllers.makeModule) {
        Controllers = require('../Controllers');
    }
}


const getTokenFromDB = function(userId, userType, loginAs, token, callback) {
    CheckIfControllerNotInitialised();

    let userData = null;
    const criteria = {
        userId: userId,
        accessToken: token,
        // loginAs: loginAs
    };
    async.series([
        function(cb) {

            if (userType == Config.APP_CONSTANTS.DATABASE_KEYS.userType.user) {

                criteria.userId = userId;

                Controllers.makeModule.accessTokens.validateAccessToken(criteria, function(err, result) {

                    if (err) return cb(err)
                    userData = result;
                    cb();
                })

            } else if (userType == Config.APP_CONSTANTS.DATABASE_KEYS.userType.admin) {
                Service.makeModule.admins.view(criteria, { loginAttempts: 0 }, { lean: true }, function(err, dataAry) {
                    if (err) {
                        callback(err)
                    } else {
                        if (dataAry && dataAry.length > 0) {
                            userData = dataAry[0];
                            cb();
                        } else {
                            callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
                        }
                    }

                });
            } else {
                cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
            }
        }
    ], function(err, result) {
        if (err) {
            callback(err)
        } else {
            if (userData && userData._id) {
                userData.id = userData._id;
                userData.type = userType;
                userData.role = userType;
            }

            callback(null, { userData: userData })
        }

    });
};




const setTokenInDB = function(tokenData, tokenToSave, callback) {

    CheckIfControllerNotInitialised();
    const userId = tokenData.id;
    const userType = tokenData.type;
    const loginAs = tokenData.loginAs;
    const deviceToken = tokenData.deviceToken;
    const deviceType = tokenData.deviceType;
    const deviceId = tokenData.deviceId;


    const criteria = {
        _id: userId
    };
    const setQuery = {
        accessToken: tokenToSave
    };
    let updatedData = {};
    async.series([

        function(cb) {
            if (userType == Config.APP_CONSTANTS.DATABASE_KEYS.userType.user) {

                const data = {
                    accessTokenSave: {
                        accessToken: tokenToSave,
                        loginAs: loginAs,
                        deviceToken: deviceToken,
                        deviceType: deviceType,
                        deviceId: deviceId,
                        userId: userId
                    }
                }

                Controllers.makeModule.accessTokens.createNewAccessToken(data, function(err, result) {
                    if (err) return cb(err)

                    updatedData = result.accessTokenData;
                    cb();

                });

            }  else if (userType == Config.APP_CONSTANTS.DATABASE_KEYS.userType.admin) {
                Service.makeModule.admins.edit(criteria, setQuery, { new: true }, function(err, dataAry) {
                    if (err) {
                        cb(err)
                    } else {
                        if (dataAry && dataAry._id) {
                            updatedData = dataAry;
                            cb();
                        } else {
                            cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
                        }
                    }

                });
            } else {
                cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
            }
        }
    ], function(err, result) {
        if (err) {
            callback(err)
        } else {
            callback(null, updatedData)
        }

    });
};

const expireTokenInDB = function(userId, userType, callback) {
    CheckIfControllerNotInitialised();

    const criteria = {
        _id: userId
    };
    const setQuery = {
        accessToken: new Date().getTime()
    };
    async.series([
        function(cb) {
            if (userType == Config.APP_CONSTANTS.DATABASE_KEYS.userType.user) {
                Service.makeModule.users.edit(criteria, setQuery, { new: true }, function(err, dataAry) {
                    if (err) {
                        cb(err)
                    } else {
                        if (dataAry && dataAry.length > 0) {
                            cb();
                        } else {
                            cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
                        }
                    }
                });

            } else if (userType == Config.APP_CONSTANTS.DATABASE_KEYS.userType.admin) {

                Service.makeModule.admins.edit(criteria, setQuery, { new: true }, function(err, dataAry) {
                    if (err) {
                        console.log(err)

                        callback(err)
                    } else {
                        if (dataAry) {
                            cb(null, 1);
                        } else {
                            callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
                        }
                    }

                });
            } else {
                cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
            }
        }
    ], function(err, result) {
        if (err) {
            callback(err)
        } else {
            callback()
        }

    });
};


const verifyToken = function(token, callback) {
    const response = {
        valid: false
    };
    Jwt.verify(token, config.get('JWT_SECRET_KEY'), function(err, decoded) {
        if (err) {
            console.log('jwt err', err)

            callback(err)
        } else {
            console.log("verifyToken===>", decoded);
            getTokenFromDB(decoded.id, decoded.type, decoded.loginAs, token, callback);
        }
    });
};

const verifyTokenAdmin = function(token, callback) {
    const response = {
        valid: false
    };
    Jwt.verify(token, config.get('JWT_SECRET_KEY'), function(err, decoded) {
        if (err) {
            console.log('jwt err', err)

            callback(err)
        } else {
            getTokenFromDB(decoded.id, decoded.type, decoded.loginAs, token, function(err, result) {

                if (err)
                    return callback(err);

                if (result.userData && result.userData.type == Config.APP_CONSTANTS.DATABASE_KEYS.userType.admin) {
                    result.adminData = result.userData;
                    return callback(null, result);
                } else {
                    return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED);
                }

            });
        }
    });
};

const setToken = function(tokenData, callback) {


    if (!tokenData.id || !tokenData.type) {
        console.log("err, data==============Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR",Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
        callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
    } else {

        tokenData.time = new Date().getTime();


        const tokenToSend = Jwt.sign(tokenData, config.get('JWT_SECRET_KEY'));

        setTokenInDB(tokenData, tokenToSend, function(err, data) {
            console.log(err, data)
            callback(err, data)
        })
    }
};

const expireToken = function(token, callback) {
    Jwt.verify(token,config.get('JWT_SECRET_KEY'), function(err, decoded) {
        if (err) {
            callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN);
        } else {
            expireTokenInDB(decoded.id, decoded.type, function(err, data) {
                callback(err, data)
            });
        }
    });
};

const decodeToken = function(token, callback) {
    Jwt.verify(token, config.get('JWT_SECRET_KEY'), function(err, decodedData) {
        if (err) {
            callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN);
        } else {
            callback(null, decodedData)
        }
    })
};

module.exports = {
    expireToken: expireToken,
    setToken: setToken,
    verifyToken: verifyToken,
    decodeToken: decodeToken,
    verifyTokenAdmin: verifyTokenAdmin


};
