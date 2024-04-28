'use strict'
var async = require('async');
var request = require('request');
var Service = require('../../Services');
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var TokenManager = require('../../Lib/TokenManager');
var UploadManager = require('../../Lib/UploadManager');
var CodeGenerator = require('../../Lib/CodeGenerator');
var NotificationManager = require('../../Lib/NotificationManager');
var Config = require('../../constant');

var config = require('config');

const _ = require('underscore');

const Jwt = require('jsonwebtoken');

console.log("pass", UniversalFunctions.CryptData("123"));

function log() {

    console.log("----------------------------------><-----------------------------");
    console.log.apply(null, arguments);
}

function echo() {
    var args, file, frame, line, method;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];

    frame = stackTrace.get()[1];
    file = path.basename(frame.getFileName());
    line = frame.getLineNumber();
    method = frame.getFunctionName();
    console.log("---------------------------------->----------------------------------<-----------------------------");

    console.log("" + file + ":" + line + " in " + method + "()");
};


const checkIfUserEmailExist = function(email) {

    return new Promise((resolve, reject) => {

        const criteria = {
            email: email,
            isDeleted: false
        };

        const projection = {};

        const option = { lean: true, limit: 1 };

        Service.makeModule.users.view(criteria, projection, option, (err, res) => {

            console.log("checkIfUserEmailExist==>", err, res);

            if (err) {
                reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SERVER_ERROR);
            } else if (res && res.length) {
                reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.EMAIL_ALREADY_EXIST);
            } else {
                resolve(false);
            }

        })

    })

};

exports.checkIfUserEmailExist = checkIfUserEmailExist;

const insertUserIntoDb = async function(userData, callback) {
    //Insert Into DB

    userData.emailVerificationToken = UniversalFunctions.CryptData(userData.email + "-" + new Date().getTime());

    const user = Service.makeModule.users.addAsync(userData);

    return user;

};

exports.insertUserIntoDb = insertUserIntoDb;


const cryptThePassword = function(password, callback) {

    return new Promise((resolve, reject) => {

        UniversalFunctions.CryptPassword(password, function(err, hash) {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });

    })

};

exports.cryptThePassword = cryptThePassword;

const matchPassword = function(password, hash) {

    return new Promise((resolve, reject) => {

        if (password && hash) {
            UniversalFunctions.matchPassword(password, hash, function(err, hash) {
                if (err) {
                    reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INCORRECT_PASSWORD)
                } else {
                    resolve(true);
                }
            });
        } else {
            reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INCORRECT_PASSWORD);
        }

    })

};

exports.matchPassword = matchPassword;

function updateUserData(criteria, setQuery, options, callback) {

    Service.makeModule.users.edit(criteria, setQuery, options, function(err, data) {

        if (err) {
            return callback(err);
        } else {
            callback(null, payloadData);
        }
    });

}
exports.updateUserData = updateUserData;


function updateUserTimezone(data, callback) {

    if (!data.timezone) {
        return callback(null, data);
    }
    var criteria = {
        _id: data.userData._id
    };
    var setQuery = {
        timezone: data.timezone
    };
    Service.UserService.updateUser(criteria, setQuery, {
        new: true
    }, function(err, result) {
        callback(null, data);
    });

}
exports.updateUserTimezone = updateUserTimezone;



/**
 * [crating and updating a accesstoken for this user _id]
 * @param  {[type]}   payloadData [__id]
 * @param  {Function} callback    [description]
 * @return {[type]}               [description]
 */
function updateAccessToken(userData, deviceData) {

    return new Promise((resolve, reject) => {

        TokenManager = require('../../Lib/TokenManager');

        var tokenData = {
            id: userData._id,
            loginAs: userData.loginAs,
            type: Config.APP_CONSTANTS.DATABASE_KEYS.userType.user,
            userRole: userData.userRole,
            deviceType: deviceData.type
        };
        console.log('========= tokenData =========================== tokenData ================= : ', tokenData);

        TokenManager.setToken(tokenData, (err, output) => {

            if (err) {
                reject(err);
            } else {
                if (output && output.accessToken) {
                    const accessToken = output && output.accessToken;

                    resolve(accessToken);
                } else {
                    reject(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
                }
            }
        });


    })

}
exports.updateAccessToken = updateAccessToken;

// var uploadUserProfilePic = function(data, callback) {

//     if (data.profilePicURL && payloadData.profilePicURL.thumbnail == 'null') {
//         payloadData.profilePicURL = {
//             thumbnail: null,
//             original: null
//         };
//     }

//     if (payloadData.profilePic != null && payloadData.profilePic != 'null') {
//         UploadManager.uploadFileToS3WithThumbnail(payloadData.profilePic, payloadData.userDetails._id, function(err, fileData) {
//             if (!err) {

//                 payloadData.profilePicURL = {
//                     original: config.get('s3Bucket').bucketUrl + fileData.original,
//                     thumbnail: config.get('s3Bucket').bucketUrl + fileData.thumbnail
//                 };
//                 callback(null, payloadData);
//             } else {
//                 callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.ERROR_PROFILE_PIC_UPLOAD);
//             }
//         });
//     } else {
//         callback(null, payloadData);
//     }
// }


// exports.uploadUserProfilePic = uploadUserProfilePic;


var updateDeviceAttributes = function(data, callback) {
    var modelName = ""
    if (data.userData.userType === Config.APP_CONSTANTS.DATABASE.userType.User) {
        modelName = "users"
    }
    if (data.userData.userType === Config.APP_CONSTANTS.DATABASE.userType.Company) {
        modelName = "companies"
    }
    if (data.userData.userType === Config.APP_CONSTANTS.DATABASE.userType.Advisor) {
        modelName = "advisors"
    }
    var criteria = {
        _id: data.userData._id
    };
    var setQuery = {
        // appVersion: data.payload.appVersion,
        lastLoginAt: new Date()
    };
    Service.makeModule[modelName].edit(criteria, setQuery, {
        new: true
    }, function(err, result) {
        if (err) echo();
        callback(null, data);
    });
}

exports.updateDeviceAttributes = updateDeviceAttributes;


var checkAppVersion = function(data, callback) {


    Service.AppVersionService.getAppVersion({}, {}, { lean: true }, function(err, result) {
        if (err)
            return callback(err);
        if (result && result.length && result[0]._id) {

            if (result[0].criticalIOSVersion > data.appVersion) {
                data.updatePopup = 1;
                data.critical = 1;
            } else if (result[0].latestIOSVersion > data.appVersion) {
                data.updatePopup = 1;
                data.critical = 0;
            } else {
                data.updatePopup = 0;
                data.critical = 0;
            }
            return callback(null, data);

        } else {
            data.updatePopup = 0;
            data.critical = 0;
            return callback(null, data);
        }
    });
}

exports.checkAppVersion = checkAppVersion;


var updateUserProfileData = function(data, callback) {
    var criteria = {
        _id: data.payload._id
    };

    var dataToSave = {};
    for (let k in data) {
        dataToSave[k] = data[k];
    }

    Service.makeModule.users.edit(criteria, dataToSave, { "new": true }, callback);
}

exports.updateUserProfileData = updateUserProfileData;

// var userDataAfterUpdate = function(data, callback) {

//     var criteria = {
//         _id: payloadData._id,
//     };

//     criteria.population = { path: 'interest', model: 'Interests', select: 'interestName icon' };

//     Service.makeModule.users.view(criteria, {}, { lean: true }, function(err, result) {

//         if (err) {
//             return callback(err);
//         } else {

//             if (!result.length) {
//                 return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.CANT_FIND);
//             }

//             if (result[0] && result[0].dob && result[0].dob.value) {
//                 var dob = changeDate(result[0].dob.value);
//                 result[0].dob.value = dob;
//             }
//             return callback(null, result[0]);
//         }
//     });
// }

// exports.userDataAfterUpdate = userDataAfterUpdate;



var updateNewCodeIntoDb = function(data, callback) {
    var newOtp = CodeGenerator.generateRandomNumber(1000, 9999);

    var criteria = {
        _id: data.userData.id
    };
    var dataToSet = {
        otpCode: newOtp,
        countryCode: data.payload.countryCode,
        phone: data.payload.phone
    };
    var options = {
        new: true
    }

    Service.makeModule.users.edit(criteria, dataToSet, options, function(err, result) {
        if (err) {
            callback(err);
        } else {

            data.userData = result;
            callback(null, data);
        }
    })
}

exports.updateNewCodeIntoDb = updateNewCodeIntoDb

var sendOtpToUser = function(data, callback) {


    var msgHandlebarData = {
        verificationCode: data.userData.otpCode
    }

    let phoneNo = data.userData.countryCode + data.userData.phone;

    var smsNotifData = {
        phone: phoneNo,
        handlebarData: msgHandlebarData,
        title: "verificationCodeMsg"
    }

    NotificationManager.sendSMSToUser(smsNotifData, function(err, result) {
        return callback(err, data);
    })
}

exports.sendOtpToUser = sendOtpToUser;

const getUserForLogin = async function(criteria, projection) {

    // const option = {
    //     lean: true,
    //     limit: 1
    // };

    // const user = await Service.makeModule.users.viewAsync(criteria, projection, option);

    // return user[0];

    return new Promise((resolve, reject) => {

        const option = {
            lean: true,
            limit: 1
        };

        Service.makeModule.users.viewAsync(criteria, projection, option).then((result) => {
            const userFound = result && result[0] || null;
            if (!userFound) {
                reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.EMAIL_NOT_FOUND);
            } else if (userFound.isBlocked) {
                reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.ACCOUNT_BLOCKED);
            } else {
                resolve(userFound);
            }
        }).catch((err) => {
            reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SERVER_ERROR);
        })

    })

}

exports.getUserForLogin = getUserForLogin;

const getUserFromDb = async function(criteria, projection) {

    // const option = {
    //     lean: true,
    //     limit: 1
    // };

    // const user = await Service.makeModule.users.viewAsync(criteria, projection, option);

    // return user[0];

    return new Promise((resolve, reject) => {

        const option = {
            lean: true,
            limit: 1
        };

        Service.makeModule.users.viewAsync(criteria, projection, option).then((result) => {
            const userFound = result && result[0] || null;
            if (!userFound) {
                reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.USER_NOT_FOUND);
            } else {
                resolve(userFound);
            }
        }).catch((err) => {
            reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SERVER_ERROR);
        })

    })

}

exports.getUserFromDb = getUserFromDb;


const setResetPasswordToken = async function(user) {

    const tokenObj = { id: user._id, time: new Date().getTime() };

    const token = Jwt.sign(tokenObj, config.get('JWT_SECRET_KEY'));

    const criteria = { _id: user._id };

    const projection = { resetPasswordToken: token };

    const option = { new: true };

    const updatedUser = await Service.makeModule.users.editAsync(criteria, projection, option);

    return updatedUser;

    // return new Promise((resolve, reject) => {

    //     const tokenObj = { id: user._id, time: new Date().getTime() };

    //     const token = Jwt.sign(tokenObj, config.get('JWT_SECRET_KEY'));

    //     const criteria = { _id: user._id };

    //     const projection = { resetPasswordToken: token };

    //     const option = { new: true };

    //     Service.makeModule.users.editAsync(criteria, projection, option).then((result) => {
    //         resolve(result);
    //     }).catch((err) => {
    //         reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SERVER_ERROR);
    //     })

    // })

}

exports.setResetPasswordToken = setResetPasswordToken;


const sendResetPasswordEmail = function(user, resetLink) {

    const obj = {
        password_reset_link: resetLink,
        user_name: user.firstName
    }

    const emailObj = {
        title: "forgotPassword",
        handlebarData: obj,
        email: user.email
    }

    NotificationManager.sendEmailToUser(emailObj, (err, res) => {

        console.log("sendResetPasswordEmail===>", err, res);

        return {};

    })

}

exports.sendResetPasswordEmail = sendResetPasswordEmail;

const sendUserVerificationEmail = function(user, verifyLink) {

    const obj = {
        emailVerificationLink: verifyLink,
        user_name: user.firstName
    }

    const emailObj = {
        title: "userVerificationEmail",
        handlebarData: obj,
        email: user.email
    }

    NotificationManager.sendEmailToUser(emailObj, (err, res) => {

        console.log("sendUserVerificationEmail===>", err, res);

        return {};

    })

}

exports.sendUserVerificationEmail = sendUserVerificationEmail;

const verifyEmailToken = async function(token) {

    return new Promise((resolve, reject) => {

        const criteria = { emailVerificationToken: token };

        const projection = { $unset: { emailVerificationToken: "" }, emailVerified: true };

        Service.makeModule.users.editAsync(criteria, projection, { new: true }).then((result) => {
            if(result) {
                return resolve(result);
            } else {
                return reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_CODE);
            }
        }).catch((err) => {
            return reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_CODE);
        })

    })

}

exports.verifyEmailToken = verifyEmailToken;

var checkPasswordResetToken = function(user, token) {

    return new Promise((resolve, reject) => {

        if (token != user.resetPasswordToken) {
            reject(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_RESET_PASSWORD_TOKEN);
        } else {
            resolve(1);
        }

    })

}

exports.checkPasswordResetToken = checkPasswordResetToken;

var resetPasswordAndUnsetToken = async function(user, hash) {

    const criteria = { _id: user._id };

    const projection = { password: hash, $unset: { "resetPasswordToken": 1 } }

    const options = {}

    const updatedUser = await Service.makeModule.users.editAsync(criteria, projection, options);

    return updatedUser;

    // return new Promise((resolve, reject) => {

    //     const criteria = { _id: user._id };

    //     const projection = { password: hash, $unset: { "resetPasswordToken": 1 } }

    //     const options = {}

    //     Service.makeModule.users.editAsync(criteria, projection, options).then((res) => {
    //         resolve(1);
    //     }).catch((err) => {
    //         reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SERVER_ERROR);
    //     })

    // })

}

exports.resetPasswordAndUnsetToken = resetPasswordAndUnsetToken;

const uploadFileByUser = function(user, file) {

    return new Promise((resolve, reject) => {

        if (!file) {
            reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.ERROR_FILE_UPLOAD);
        } else {
            let folder = user._id.toString();

            let mimeType = file.type;

            if (!mimeType) {
                mimeType = file.headers["content-type"];
            }

            const fileType = mimeType.split("/")[0];

            UploadManager.uploadFileToS3Bucket(file, folder, 's3BucketAppCredentials', (fileData) => {

                if (fileData) {
                    const url = config.get('s3Bucket').bucketUrl + "/" + folder + '/' + fileData;
                    var dataToReturn = {
                        original: url,
                        thumbnail: url,
                        fileType: fileType,
                        mimeType: mimeType,
                        name: file.filename || file.name
                    }
                    resolve(dataToReturn);
                } else {
                    reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.ERROR_FILE_UPLOAD);
                }
            });
        }

    })

}

exports.uploadFileByUser = uploadFileByUser;

const deleteUserAccessToken = function(user) {

    return new Promise((resolve, reject) => {

        const accessTokenController = require('../../Controllers').makeModule.accessTokens;

        const criteria = {
            accessToken: user.accessTokenDetails.accessToken
        };

        accessTokenController.deleteAccessToken(criteria, (err, res) => {
            if (err) {
                reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SERVER_ERROR);
            } else {
                resolve({});
            }
        })

    })

}

exports.deleteUserAccessToken = deleteUserAccessToken;

var updateNewPassword = function(data, callback) {

    var setQuery = {
        $set: {
            firstTimeLogin: false,
            password: UniversalFunctions.CryptData(data.payload.newPassword)
        }
    };
    if (data.payload.passwordResetToken) {
        setQuery['$unset'] = { passwordResetToken: 1 };
    }


    var options = {
        lean: true
    };
    Service.makeModule.users.edit(data.criteria, setQuery, options, callback);

}

exports.updateNewPassword = updateNewPassword;


var checkIfPhoneNoExist = function(data, callback) {

    var criteria = {
        phone: data.phone,
        isDeleted: false
    }
    var projection = {
        name: 1
    }
    var options = {
        lean: true
    }

    Service.makeModule.users.view(criteria, projection, options, function(err, result) {
        if (err)
            return callback(err);

        if (result && result.length && result[0]._id != data.userData._id.toString()) {
            return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.PHONE_NO_EXIST);
        } else {
            data.phoneVerified = false;
            return callback(null, data);
        }
    })

}

exports.checkIfPhoneNoExist = checkIfPhoneNoExist;

// var insertNotificationForUser = function(data, callback) {

//     var criteria = {
//         "referal.kind": data.notificationData.referal.kind,
//         "referal.referId": data.notificationData.referal.referId,
//         notificationType: data.notificationData.notificationType,
//         notificationRelatedTo: data.notificationData.notificationRelatedTo
//     }

//     var objToSave = data.notificationData;

//     var options = {
//         upsert: true,
//         new: true,
//         lean: true,
//         setDefaultsOnInsert: true
//     }

//     Service.NotificationService.edit(criteria, objToSave, options, function(err, response) {
//         if (err) {
//             return callback(err);
//         } else {
//             return callback(null, response);
//         }
//     });
// }

// exports.insertNotificationForUser = insertNotificationForUser;


var getUserProfileData = function(data, callback) {

    if (!data.payload || !data.payload._id) {
        callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
    } else {
        var criteria = {
            _id: data.payload._id,
            isBlocked: false,
            isDeleted: false,
            population: [{ path: "university" }, { path: "specialization" }]
        };


        var projection = {
            name: 1,
            familyName: 1,
            university: 1,
            email: 1,
            profilePicURL: 1,
            gender: 1,
            phone: 1,
            phoneVerified: 1,
            emailVerified: 1,
            nickName: 1,
            aboutText: 1,
            specialization: 1,
            university: 1,
            levelOfStudy: 1,
            cumulativeAverage: 1,
            advisorEmail: 1,
            biographyURL: 1,
            academicRegistrationURL: 1,
            otherFileURL1: 1,
            otherFileURL2: 1,
            userType: 1,

        };
        var options = {
            lean: true,
            limit: 1
        };

        if (data.projection) {
            projection = data.projection;
        }

        Service.makeModule.users.view(criteria, projection, options, function(err, result) {

            if (err) {
                return callback(err);
            } else {
                if (!result.length) {
                    return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.CANT_FIND);
                }
                data.profileData = result[0];

                if (data.profileData && data.profileData.dob && data.profileData.dob.value) {
                    var dob = changeDate(data.profileData.dob.value);
                    data.profileData.dob.value = dob;
                }

                return callback(null, data);
            }
        })
    }
}
exports.getUserProfileData = getUserProfileData;

var getUsersNotificationCount = function(data, callback) {

    var criteria = {
        "associatedUser.kind": 'Users',
        "associatedUser.referId": data.userData._id,
        viewed: false,
    };


    Service.makeModule.notifications.count(criteria, function(err, result) {
        if (err) {
            return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SERVER_ERROR);
        } else {
            return callback(null, result);
        }
    });
};

exports.getUsersNotificationCount = getUsersNotificationCount;


var changeDate = function(date) {

    var dt = new Date(date);
    var mnth = dt.getMonth() + 1
    var dte = dt.getDate();
    if (mnth < 10) {
        mnth = '0' + mnth;
    }
    if (dte < 10) {
        dte = '0' + dte;
    }


    return mnth + '-' + dte + '-' + dt.getFullYear();
}

var getUserUnreadNotificationCount = function(data, callback) {
    var criteria = {
        userId: data.userData.id,
        viewed: false
    };

    Service.makeModule.notifications.count(criteria, callback);
}