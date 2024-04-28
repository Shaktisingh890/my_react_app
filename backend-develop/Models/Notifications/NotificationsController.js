var Service = require('../../Services');
var Models = require('../../Models');
var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var controllerHelper = require('../../Controllers/commonControllerFunctions');
var Config = require('../../constant');


function startSection(sectionName) {

    console.log('=====================' + sectionName + '===================')
}


function NotificationsController(service) {


    //console.log('============================================NotificationsController controller initialised')
    ControllerModule.call(this, service);
}

NotificationsController.prototype = Object.create(ControllerModule.prototype)

NotificationsController.prototype.getNotificationsList = async function getNotificationsList(data) {

    const criteria = { userId: data.userData._id, isArchived: false, isDeleted: false };

    const options = { lean: true, sort: { createdAt: -1 } };

    if(data.payload.dateTime) {
        criteria.createdAt = { $gt: new Date(data.payload.dateTime) }
    } else {
        const limit = data.payload.count || Config.APP_CONSTANTS.PAGE_LIMIT.DEFAULT_LIMIT;
        const skip = (data.payload.page || 0) * limit;

        options.limit = limit;
        options.skip = skip;
    }

    const notifications = await this.service.viewAsync(criteria, {}, options);

    return notifications;

}

NotificationsController.prototype.updateNotificationAsRead = async function updateNotificationAsRead(data) {

    const criteria = { userId: data.userData._id, _id: data.payload._id };

    const projection = { isRead: data.payload.isRead };

    const notification = await this.service.editAsync(criteria, projection, {});

    return {};

}

NotificationsController.prototype.updateNotificationAsViewed = async function updateNotificationAsViewed(data) {

    const criteria = { userId: data.userData._id, isDeleted: false, isViewed: false };

    const projection = { isViewed: true };

    const notification = await this.service.multiEditAsync(criteria, projection, {multi: true});

    return {};

}

NotificationsController.prototype.updateAllNotificationAsRead = async function updateAllNotificationAsRead(data) {

    const criteria = { userId: data.userData._id, isDeleted: false, isRead: false };

    const projection = { isRead: true };

    const notification = await this.service.multiEditAsync(criteria, projection, {multi: true});

    return {};

}


NotificationsController.prototype.deleteUserNotification = async function deleteUserNotification(data) {

    const criteria = { userId: data.userData._id, _id: data.payload._id };

    const projection = { isDeleted: true };

    const notification = await this.service.editAsync(criteria, projection, {});

    return {};

}

NotificationsController.prototype.getNotificationsCounts = async function getNotificationsCounts(data) {

    const totalCriteria = { userId: data.userData._id, isRead: false, isArchived: false, isDeleted: false };

    const total = await this.service.countAsync(totalCriteria);

    const chatCriteria = { screen: "CHAT", userId: data.userData._id, isRead: false, isArchived: false, isDeleted: false };

    const chat = await this.service.countAsync(chatCriteria);

    const proposalCriteria = { screen: "PROPOSAL_MANAGEMENT", userId: data.userData._id, isRead: false, isArchived: false, isDeleted: false };

    const proposal = await this.service.countAsync(proposalCriteria);

    return {total, chat, proposal};

}

module.exports = {
    'notifications': new NotificationsController(Service.makeModule.notifications)
};;