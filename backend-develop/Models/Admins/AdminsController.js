var Service = require('../../Services');
var Models = require('../../Models');
var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var controllerHelper = require('../../Controllers/commonControllerFunctions');
var Config = require('../../constant');
var config = require('config');

const _ = require('underscore');

const Jwt = require('jsonwebtoken');
var NotificationManager = require('../../Lib/NotificationManager');
var UploadManager = require('../../Lib/UploadManager');

const mongoose = require('mongoose');

function startSection(sectionName) {

    console.log('=====================' + sectionName + '===================')
}


function AdminsController(service) {


    //console.log('============================================AdminsController controller initialised')
    ControllerModule.call(this, service);
}

AdminsController.prototype = Object.create(ControllerModule.prototype)

AdminsController.prototype.adminLogin = async function adminLogin(data) {

    const criteria = { email: data.payload.email };

    const projection = {};

    const admin = await this.service.viewAsyncById(criteria, projection, { lean: true });

    const matchPwd = await UniversalFunctions.matchPasswordPromise(data.payload.password, admin.password);

    const tokenData = {
        id: admin._id,
        username: admin.name,
        type: Config.APP_CONSTANTS.DATABASE_KEYS.userType.admin
    };

    let token = await setAccessTokenInDB(tokenData);

    let response = { email: admin.email, name: admin.name, token: token, _id: admin._id };

    return response;

}

AdminsController.prototype.adminLogout = async function adminLogout(data) {

    const criteria = { accessToken: data.token };

    const projection = {};

    const admin = await this.service.editAsync(criteria, {$unset: {accessToken: ""}}, {});

    return {};

}

const setAccessTokenInDB = function(tokenObj) {

   return new Promise((resolve, reject) => {
    const TokenManager = require('../../Lib/TokenManager');
      TokenManager.setToken(tokenObj, (err, res) => {
         if(err || !res || !res.accessToken) {
            reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SERVER_ERROR);
         } else {
            resolve(res.accessToken);
         }
      })
   })

}

AdminsController.prototype.uploadFileFromAdmin = async function uploadFileFromAdmin(data) {

    const fileUpload = await uploadFile.call(null, data.adminData, data.payload.file);

    return fileUpload;

}

const uploadFile = function(admin, file) {

    return new Promise((resolve, reject) => {

        if (!file) {
            reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.ERROR_FILE_UPLOAD);
        } else {
            let folder = "admin_" + admin._id.toString();

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


AdminsController.prototype.getAdminResetPasswordToken = async function getAdminResetPasswordToken(data) {

    const criteria = { email: data.payload.email };

    const projection = { password: 0 };

    const adminData = await this.service.viewAsync(criteria, projection, {lean: true, limit: 1});

    if(!adminData.length) {
        return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.EMAIL_NOT_FOUND);
    }

    const admin = adminData[0];

    const tokenObj = { id: admin._id, time: new Date().getTime() };

    const token = Jwt.sign(tokenObj, config.get('JWT_SECRET_KEY'));

    const resetToken = await this.service.editAsync({_id: admin._id}, {passwordResetToken: token}, {new: true})

    const link = config.get("webUrl").adminResetPassword + "?token=" + resetToken.passwordResetToken + "&id=" + admin._id;

    const mail = await sendResetPasswordEmail(resetToken, link);

    return {};

}

const sendResetPasswordEmail = function(admin, resetLink) {

    return new Promise((resolve, reject) => {
        const obj = {
            password_reset_link: resetLink,
            user_name: admin.name
        }

        const emailObj = {
            title: "forgotPassword",
            handlebarData: obj,
            email: admin.email
        }

        NotificationManager.sendEmailToUser(emailObj, (err, res) => {

            console.log("sendResetPasswordEmail===>", err, res);

            resolve({});

        })
    })

}

AdminsController.prototype.verifyAdminResetPasswordToken = async function verifyAdminResetPasswordToken(data) {

    const criteria = { _id: data.payload.id, passwordResetToken: data.payload.token };

    const projection = { password: 0 };

    const adminData = await this.service.viewAsync(criteria, projection, {lean: true, limit: 1});

    if(!adminData.length) {
        return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_RESET_PASSWORD_TOKEN);
    }

    return {};

}

AdminsController.prototype.resetAdminPassword = async function resetAdminPassword(data) {

    const criteria = { _id: data.payload.id, passwordResetToken: data.payload.token };

    const projection = { password: 0 };

    const adminData = await this.service.viewAsync(criteria, projection, {lean: true, limit: 1});

    if(!adminData.length) {
        return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_RESET_PASSWORD_TOKEN);
    }

    const hash = await cryptThePassword(data.payload.password);

    const updatePassword = await this.service.editAsync({_id: data.payload.id}, {password: hash}, {});

    return {};

}

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

AdminsController.prototype.updateAdminProfile = async function updateAdminProfile(data) {

    const criteria = { email: data.payload.email, _id: { $ne: mongoose.Types.ObjectId(data.payload._id) } };

    const projection = { password: 0 };

    const existingEmail = await this.service.viewAsync(criteria, projection, {lean: true, limit: 1});

    if(existingEmail.length) {
        return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.EMAIL_ALREADY_EXIST);
    }

    const updateProfile = await this.service.editAsync({_id: data.payload._id}, data.payload, {});

    return {};

}

AdminsController.prototype.changeAdminPassword = async function changeAdminPassword(data) {

    const passwordMatched = await matchPassword(data.payload.oldPassword, data.adminData.password);

    const hash = await cryptThePassword(data.payload.newPassword);

    const updateProfile = await this.service.editAsync({_id: data.payload._id}, {password: hash}, {});

    return {};

}


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

module.exports = {
    'admins': new AdminsController(Service.makeModule.admins)
};;