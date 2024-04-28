var Service = require('../../Services');
var Models = require('../../Models');
var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var controllerHelper = require('../../Controllers/commonControllerFunctions');
var Config = require('../../constant');

const config = require("config");
var NotificationManager = require('../../Lib/NotificationManager');

function startSection(sectionName) {

   console.log('=====================' + sectionName + '===================')
}


function ProposalInvitesController(service) {


   //console.log('============================================ProposalInvitesController controller initialised')
   ControllerModule.call(this, service);
}

ProposalInvitesController.prototype = Object.create(ControllerModule.prototype)

ProposalInvitesController.prototype.askForProposal = async function askForProposal(data) {

   const project = await Service.makeModule.projects.viewAsyncById({_id: data.payload.projectId, brandId: data.userData._id}, {}, {lean: true, limit: 1});

   const serviceProvider = await Service.makeModule.users.viewAsyncById({_id: data.payload.serviceProviderId}, {password: 0}, {lean: true, limit: 1});

   const objToSave = {
      brandId: data.userData._id,
      serviceProviderId: data.payload.serviceProviderId,
      projectId: project._id
   };

   const invite = await this.service.editAsync(objToSave, {isDeleted: false}, {upsert: true, setDefaultsOnInsert: true, new: true});

   const inviteEmail = await this.sendProposalInviteEmail(data.userData, serviceProvider, project);

   await sendProposalInviteNotificationToSP(data.userData, serviceProvider, project);

   return {};

}

function sendProposalInviteNotificationToSP(brand, serviceProvider, project) {

    const handlebarObj = {
        brandName: brand.businessName,
        projectName: project.name
    }

    const notifObj = Config.APP_CONSTANTS.NOTIFICATIONS.PUSH.NEW_PROPOSAL_REQUEST;

    notifObj.message = UniversalFunctions.renderMessageFromTemplateAndVariables(notifObj.message, handlebarObj);

    notifObj.userId = serviceProvider._id;
    notifObj.sentBy = brand._id;
    notifObj.notificationType = Config.APP_CONSTANTS.NOTIFICATIONS.TYPE.PROJECT;

    notifObj.extraData = { _id: project._id, brandId: brand._id, serviceProviderId: serviceProvider._id };

    return Service.makeModule.notifications.addAsync(notifObj);

}

ProposalInvitesController.prototype.sendProposalInviteEmail = function sendProposalInviteEmail(brand, serviceProvider, project) {

    return new Promise((resolve, reject) => {

        const obj = {
            brandName: brand.businessName,
            serviceProviderName: serviceProvider.businessName,
            projectName: project.name,
            projectUrl: config.get("webUrl").projectDetailUrl + project._id
        }

        const emailObj = {
            title: "askedForProposal",
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
   'proposalInvites': new ProposalInvitesController(Service.makeModule.proposalInvites)
};;