var Service = require('../../Services');
var Models = require('../../Models');
var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var controllerHelper = require('../../Controllers/commonControllerFunctions');
var Config = require('../../constant');
var NotificationManager = require('../../Lib/NotificationManager');
const config = require("config");


function startSection(sectionName) {

   console.log('=====================' + sectionName + '===================')
}


function SentProjectBriefsController(service) {

 
   //console.log('============================================SentProjectBriefsController controller initialised')
   ControllerModule.call(this, service);
}

SentProjectBriefsController.prototype = Object.create(ControllerModule.prototype)

SentProjectBriefsController.prototype.addSentProjectBriefDetails = async function addSentProjectBriefDetails(data) {

   const criteria = { _id: data.payload.chatId, population: [{path: "brandId"}, {path: "serviceProviderId"}, {path: "projectId"}] }

   const chat = await Service.makeModule.chats.viewAsyncById(criteria, {}, {lean: true, limit: 1});

   const objToSave = {
      brandId: chat.brandId._id,
      serviceProviderId: chat.serviceProviderId._id,
      projectId: chat.projectId._id,
      chatId: chat._id,
      status: "sent",
      sentAt: new Date(),
      projectDetails: JSON.stringify(chat.projectId)
   };

   const sentBrief = await this.service.addAsync(objToSave);

   const sentEmail = await this.sendProjectBriefEmail(chat.brandId, chat.serviceProviderId, chat.projectId, chat._id);

   await sendProjectBriefNotificationToSP(chat.brandId, chat.serviceProviderId, chat.projectId, chat._id);

   return {};

}

function sendProjectBriefNotificationToSP(brand, serviceProvider, project, chatId) {

    const handlebarObj = {
        brandName: brand.businessName,
        projectName: project.name
    }

    const notifObj = Config.APP_CONSTANTS.NOTIFICATIONS.PUSH.NEW_PROJECT_BRIEFING;

    notifObj.message = UniversalFunctions.renderMessageFromTemplateAndVariables(notifObj.message, handlebarObj);

    notifObj.userId = serviceProvider._id;
    notifObj.sentBy = brand._id;
    notifObj.notificationType = Config.APP_CONSTANTS.NOTIFICATIONS.TYPE.PROJECT;

    notifObj.extraData = { _id: chatId, brandId: brand._id, serviceProviderId: serviceProvider._id, projectId: project._id };

    return Service.makeModule.notifications.addAsync(notifObj);

}

SentProjectBriefsController.prototype.sendProjectBriefEmail = function sendProjectBriefEmail(brand, serviceProvider, project, chatId) {

    return new Promise((resolve, reject) => {

        const obj = {
            brandName: brand.businessName,
            serviceProviderName: serviceProvider.businessName,
            projectName: project.name,
            chatUrl: config.get("webUrl").chatUrl + chatId
        }

        const emailObj = {
            title: "brandSharedProjectBriefing",
            handlebarData: obj,
            email: serviceProvider.email
        }

        NotificationManager.sendEmailToUser(emailObj, (err, res) => {

            console.log("sendProposalInviteEmail===>", err, res);

            resolve({});

        })

    })

}

module.exports = {
   'sentProjectBriefs': new SentProjectBriefsController(Service.makeModule.sentProjectBriefs)
};;