'use strict'
var Service = require('../../Services');
var Models = require('../../Models');
var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var controllerHelper = require('../../Controllers/commonControllerFunctions');
var Config = require('../../constant');
var UploadManager = require('../../Lib/UploadManager');
var NotificationManager = require('../../Lib/NotificationManager');

var helper = require('./userControllerHelper');

const _ = require('underscore');
var config = require('config');

function startSection(sectionName) {

    console.log('=====================' + sectionName + '===================')
}


function UsersController(service) {

    //console.log('============================================UsersController controller initialised')
    ControllerModule.call(this, service);
}

UsersController.prototype = Object.create(ControllerModule.prototype)

UsersController.prototype.parentEdit = UsersController.prototype.edit;

UsersController.prototype.edit = async function(data, callback) {

    try {
        const user = await this.service.viewAsyncById(data.criteria, {}, {lean: true, limit: 1});

        const updatedUser = await this.service.editAsync(data.criteria, data.projection, data.options);

        if(!user.approvedByAdmin && updatedUser.approvedByAdmin) {
            sendProfileApprovedEmailToUser(updatedUser);
        }

        return callback(null, updatedUser);

    } catch(err) {
        return callback(err);
    }

}

function sendProfileApprovedEmailToUser(user) {
    const obj = {
        businessName: user.businessName
    }

    const emailObj = {
        title: "profileApproved",
        handlebarData: obj,
        email: user.email
    }

    NotificationManager.sendEmailToUser(emailObj, (err, res) => {

        console.log("sendProfileApprovedEmailToUser===>", err, res);

    })
}

UsersController.prototype.createNewUser = async function createNewUser(data) {

    const userExist = await helper.checkIfUserEmailExist.call(null, data.payload.email);

    const hash = await helper.cryptThePassword.call(null, data.payload.password);

    let obj = _.clone(data.payload);

    obj.password = hash;

    let user = await helper.insertUserIntoDb.call(null, obj);

    let token = await helper.updateAccessToken.call(null, user, { type: Config.APP_CONSTANTS.DATABASE_KEYS.deviceType.web });

    let response = _.clone(user);

    response.accessToken = token;

    const verifyLink = config.get("webUrl").userEmailVerification + "?token=" + response.emailVerificationToken;

    const verifyEmail = await helper.sendUserVerificationEmail(response, verifyLink)

    return response;

}

UsersController.prototype.loginUser = async function loginUser(data) {

    const criteria = { email: data.payload.email, isDeleted: false };

    const projection = {};

    const userData = await helper.getUserForLogin.call(null, criteria, projection);

    const matchPwd = await helper.matchPassword.call(null, data.payload.password, userData.password);

    let token = await helper.updateAccessToken.call(null, userData, { type: Config.APP_CONSTANTS.DATABASE_KEYS.deviceType.web });

    let response = _.clone(userData);

    delete response.password;

    response.accessToken = token;

    return response;

}

UsersController.prototype.getUserDetailsById = async function getUserDetailsById(data) {

    const criteria = { _id: data.payload._id, isDeleted: false };

    const projection = { password: 0 };

    if(data.userData._id.toString() != data.payload._id.toString()) {
        projection.bankAccDetails = 0;
    }

    const userData = await helper.getUserFromDb.call(null, criteria, projection);

    if (data.payload.projectId && data.userData._id.toString() != userData._id.toString() &&
        data.userData.userRole === Config.APP_CONSTANTS.DATABASE_KEYS.userRole.brand &&
        userData.userRole === Config.APP_CONSTANTS.DATABASE_KEYS.userRole.serviceProvider) {

        const shortlistCriteria = { projectId: data.payload.projectId, brandId: data.userData._id, serviceProviderId: userData._id, isDeleted: false };

        const shortlisted = await Service.makeModule.shortlistedServiceProviders.viewAsync(shortlistCriteria, {}, { lean: true, limit: 1 });

        userData.isShortlisted = shortlisted.length ? true : false;

        const proposalInvite = await Service.makeModule.proposalInvites.viewAsync({ projectId: data.payload.projectId, brandId: data.userData._id, serviceProviderId: userData._id, isDeleted: false }, {}, { lean: true, limit: 1 });

        userData.askedForProposal = proposalInvite.length ? true : false;

        const proposalSent = await Service.makeModule.proposals.viewAsync({ projectId: data.payload.projectId, brandId: data.userData._id, serviceProviderId: userData._id, isDeleted: false }, {}, { lean: true, limit: 1, sort: { createdAt: -1 } });

        userData.proposalSent = proposalSent.length ? true : false;

        if (userData.proposalSent)
            userData.proposalId = proposalSent[0]._id;

    }

    return userData;

}

UsersController.prototype.updateUserProfile = async function updateUserProfile(data) {

    const criteria = { _id: data.payload._id };

    const projection = data.payload;

    const options = { new: true };

    const user = await this.service.viewAsyncById(criteria, {}, { lean: true, limit: 1 });

    const updatedUser = await this.service.editAsync(criteria, projection, options);

    if (user.stepsCompleted === 1 && updatedUser.stepsCompleted === 0) {
        sendCompletedProfileEmailToUser(user);
    }

    return updatedUser;

}

function sendCompletedProfileEmailToUser(user) {
    const obj = {
        businessName: user.businessName
    }

    const emailObj = {
        title: "profileCreated",
        handlebarData: obj,
        email: user.email
    }

    NotificationManager.sendEmailToUser(emailObj, (err, res) => {

        console.log("sendCompletedProfileEmailToUser===>", err, res);

    })
}

UsersController.prototype.getResetPasswordToken = async function getResetPasswordToken(data) {

    const criteria = { email: data.payload.email, isDeleted: false };

    const projection = { password: 0 };

    const userData = await helper.getUserForLogin.call(null, criteria, projection);

    const resetToken = await helper.setResetPasswordToken.call(null, userData);

    const link = config.get("webUrl").userResetPassword + "?token=" + resetToken.resetPasswordToken + "&id=" + userData._id;

    const mail = await helper.sendResetPasswordEmail.call(null, resetToken, link);

    return {};

}


UsersController.prototype.verifyResetPasswordToken = async function verifyResetPasswordToken(data) {

    const criteria = { _id: data.payload.id, isDeleted: false };

    const projection = { password: 0 };

    const userData = await helper.getUserForLogin.call(null, criteria, projection);

    const verifyToken = await helper.checkPasswordResetToken.call(null, userData, data.payload.token);

    return {};

}

UsersController.prototype.resetUserPassword = async function resetUserPassword(data) {

    const criteria = { _id: data.payload.id, isDeleted: false };

    const projection = { password: 0 };

    const userData = await helper.getUserFromDb.call(null, criteria, projection);

    const verifyToken = await helper.checkPasswordResetToken.call(null, userData, data.payload.token);

    const hash = await helper.cryptThePassword.call(null, data.payload.password);

    const updatePassword = await helper.resetPasswordAndUnsetToken.call(null, userData, hash)

    return {};

}


UsersController.prototype.uploadFile = async function uploadFile(data) {

    const fileUpload = await helper.uploadFileByUser.call(null, data.userData, data.payload.file);

    return fileUpload;

}

UsersController.prototype.logoutUser = async function logoutUser(data) {

    const token = await helper.deleteUserAccessToken.call(null, data.userData);

    return {};

}


UsersController.prototype.verifyEmail = async function verifyEmail(data) {

    const verifyUser = await helper.verifyEmailToken(data.payload.token);

    return { userRole: verifyUser.userRole };

}

module.exports = {
    'users': new UsersController(Service.makeModule.users)
};;