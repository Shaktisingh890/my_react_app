var Service = require('../../Services');
var Models = require('../../Models');
var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var controllerHelper = require('../../Controllers/commonControllerFunctions');
var Config = require('../../constant');

const config = require("config");
var NotificationManager = require('../../Lib/NotificationManager');
const mongoose = require('mongoose');


function startSection(sectionName) {

   console.log('=====================' + sectionName + '===================')
}


function HiringsController(service) {


   //console.log('============================================HiringsController controller initialised')
   ControllerModule.call(this, service);
}

HiringsController.prototype = Object.create(ControllerModule.prototype)

HiringsController.prototype.hireServiceProvider = async function hireServiceProvider(data) {

    const proposalCriteria = { _id: data.payload.proposalId, brandId: data.userData._id, isDeleted: false, population: [{path: "serviceProviderId"}, {path: "projectId"}] };

    let proposal = await Service.makeModule.proposals.viewAsyncById(proposalCriteria, {}, { lean: true, limit: 1 });

    if(proposal.status === Config.APP_CONSTANTS.DATABASE_KEYS.proposalStatus.hired) {
        return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.ALREADY_HIRED_SERVICE_PROVIDER);
    }

    let project = await Service.makeModule.projects.viewAsyncById({_id: proposal.projectId._id, isDeleted: false}, {}, {lean: true});

    if(project.isHiringDone) {
        return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.ALREADY_HIRED_FOR_PROJECT);
    }

    const objToSave = data.payload;

    objToSave.serviceProviderId = proposal.serviceProviderId._id;
    objToSave.brandId = proposal.brandId;
    objToSave.projectId = proposal.projectId._id;

    const hiring = await this.service.addAsync(objToSave);

    updateHiredCountForBrandAndSP(proposal.brandId, proposal.serviceProviderId._id);

    proposal = await Service.makeModule.proposals.editAsync({_id: proposal._id}, {isHiringDone: true, hiringDate: new Date(), status: Config.APP_CONSTANTS.DATABASE_KEYS.proposalStatus.hired}, { lean: true });

    project = await Service.makeModule.projects.editAsync({_id: proposal.projectId._id}, {isHiringDone: true, hiringDate: new Date()}, { lean: true })

    const hiringEmail = await this.sendHiringEmailToServiceProvider(data.userData, proposal.serviceProviderId, proposal.projectId);

    await sendHiringNotificationToSP(data.userData, proposal.serviceProviderId, proposal.projectId, proposal._id);

    return hiring;

}

function sendHiringNotificationToSP(brand, serviceProvider, project, proposalId) {

    const handlebarObj = {
        brandName: brand.businessName,
        projectName: project.name
    }

    const notifObj = Config.APP_CONSTANTS.NOTIFICATIONS.PUSH.HIRED;

    notifObj.message = UniversalFunctions.renderMessageFromTemplateAndVariables(notifObj.message, handlebarObj);

    notifObj.userId = serviceProvider._id;
    notifObj.sentBy = brand._id;
    notifObj.notificationType = Config.APP_CONSTANTS.NOTIFICATIONS.TYPE.HIRING;

    notifObj.extraData = { _id: proposalId, brandId: brand._id, serviceProviderId: serviceProvider._id, projectId: project._id };

    return Service.makeModule.notifications.addAsync(notifObj);

}

HiringsController.prototype.sendHiringEmailToServiceProvider = function sendHiringEmailToServiceProvider(brand, serviceProvider, project) {

    return new Promise((resolve, reject) => {

        const obj = {
            brandName: brand.businessName,
            serviceProviderName: serviceProvider.businessName,
            projectName: project.name,
            proposalUrl: config.get("webUrl").proposalUrl
        }

        const SpEmailObj = {
            title: "hiredForProjectToSP",
            handlebarData: obj,
            email: serviceProvider.email
        }

        const BrandEmailObj = {
            title: "hiredForProjectToBrand",
            handlebarData: obj,
            email: brand.email
        }

        NotificationManager.sendEmailToUser(SpEmailObj, (err, res) => {

            console.log("sendHiringEmailToServiceProvider==SP=>", err, res);

        })

        NotificationManager.sendEmailToUser(BrandEmailObj, (err, res) => {

            console.log("sendHiringEmailToServiceProvider==Brand=>", err, res);

        })

        resolve({});

    })

}

async function updateHiredCountForBrandAndSP(brandId, serviceProviderId) {

    const spQuery = [{
        $match: {serviceProviderId: mongoose.Types.ObjectId(serviceProviderId), isRevoked: false, isDeleted: false}
    }, {
        $group: {
            _id: null,
            count: { $sum: 1 }
        }
    }]

    const hiredTimes = await Service.makeModule.hirings.aggregateAsync(spQuery, null, null);

    const spCount = (hiredTimes[0] && hiredTimes[0].count) ? hiredTimes[0].count : 0;

    const sp = await Service.makeModule.users.editAsync({_id: serviceProviderId}, {hiredTimes: spCount}, {});

    const brandQuery = [{
        $match: {brandId: mongoose.Types.ObjectId(brandId), isDeleted: false}
    }, {
        $group: {
            _id: null,
            count: { $sum: 1 }
        }
    }]

    const hiredSpCount = await Service.makeModule.hirings.aggregateAsync(brandQuery, null, null);

    const brandCount = (hiredSpCount[0] && hiredSpCount[0].count) ? hiredSpCount[0].count : 0;

    const brand = await Service.makeModule.users.editAsync({_id: brandId}, {hiredSpCount: brandCount}, {});

    return;

}

module.exports = {
   'hirings': new HiringsController(Service.makeModule.hirings)
};;