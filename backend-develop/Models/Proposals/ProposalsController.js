var Service = require('../../Services');
var Models = require('../../Models');
var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var controllerHelper = require('../../Controllers/commonControllerFunctions');
var Config = require('../../constant');

const _ = require('underscore');
const config = require("config");
var NotificationManager = require('../../Lib/NotificationManager');

function startSection(sectionName) {

    console.log('=====================' + sectionName + '===================')
}


function ProposalsController(service) {


    //console.log('============================================ProposalsController controller initialised')
    ControllerModule.call(this, service);
}

ProposalsController.prototype = Object.create(ControllerModule.prototype)

ProposalsController.prototype.parentListById = ProposalsController.prototype.listById;

ProposalsController.prototype.listById = function(data, callback) {
    (async () => {

        try {

            const proposal = await this.listByIdAsync(data);

            const invoice = await Service.makeModule.invoices.viewAsync({ proposalId: data.criteria._id, isDeleted: false }, {}, { lean: true, limit: 1, sort: { createdAt: -1 } });

            proposal.invoice = invoice[0] || null;

            return callback(null, proposal);

        } catch (e) {
            return callback(e);
        }

    })();

}

ProposalsController.prototype.sendProposal = async function sendProposal(data) {

    const projectCriteria = { _id: data.payload.projectId, isDeleted: false, population: { path: "brandId" } };

    const project = await Service.makeModule.projects.viewAsyncById(projectCriteria, {}, { lean: true, limit: 1 })

    const existingProposal = await this.service.viewAsync({ projectId: project._id, serviceProviderId: data.userData._id, isDeleted: false }, {}, { lean: true, limit: 1 });

    if (existingProposal && existingProposal.length) {
        return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.ALREADY_SUBMITTED_PROPOSAL);
    }

    const objToSave = data.payload;

    objToSave.serviceProviderId = data.userData._id;
    objToSave.brandId = project.brandId._id;

    const proposal = await this.service.addAsync(objToSave);

    updateSentProposalCountForSP(data.userData._id);

    const projectCounter = await Service.makeModule.projects.editAsync({ _id: data.payload.projectId }, { $inc: { proposalsReceived: 1 } }, {})

    const proposalEmail = await this.sendProposalEmailToBrand(project.brandId, data.userData, project, "newProposalReceived");

    await sendProposalNotificationToBrand(project.brandId, data.userData, project, proposal, "NEW_PROPOSAL_RECEIVED");

    return proposal;

}

function sendProposalNotificationToBrand(brand, serviceProvider, project, proposal, template) {

    const handlebarObj = {
        serviceProviderName: serviceProvider.businessName,
        projectName: project.name
    }

    const notifObj = Config.APP_CONSTANTS.NOTIFICATIONS.PUSH[template];

    notifObj.message = UniversalFunctions.renderMessageFromTemplateAndVariables(notifObj.message, handlebarObj);

    notifObj.userId = brand._id;
    notifObj.sentBy = serviceProvider._id;
    notifObj.notificationType = Config.APP_CONSTANTS.NOTIFICATIONS.TYPE.PROPOSAL;

    notifObj.extraData = { _id: proposal._id, projectId: project._id, brandId: brand._id, serviceProviderId: serviceProvider._id };

    return Service.makeModule.notifications.addAsync(notifObj);

}

ProposalsController.prototype.sendProposalEmailToBrand = function sendProposalEmailToBrand(brand, serviceProvider, project, template) {

    return new Promise((resolve, reject) => {

        const obj = {
            brandName: brand.businessName,
            serviceProviderName: serviceProvider.businessName,
            projectName: project.name,
            proposalUrl: config.get("webUrl").proposalUrl
        }

        const emailObj = {
            title: template,
            handlebarData: obj,
            email: brand.email
        }

        NotificationManager.sendEmailToUser(emailObj, (err, res) => {

            console.log("sendProposalEmailToBrand===>", err, res);

            resolve({});

        })

    })

}

ProposalsController.prototype.getProposalsListForServiceProvider = async function getProposalsListForServiceProvider(data) {

    const criteria = {
        serviceProviderId: data.userData._id,
        isDeleted: false,
        population: [{ path: "projectId", select: "name briefType objective hideBrandDetails", match: { isDeleted: false } }, { path: "brandId", select: "businessName logo description email", match: { isDeleted: false } }, { path: "serviceProviderId", select: "businessName logo description email", match: { isDeleted: false } }]
    };

    const projection = { isArchived: 0, isDeleted: 0 };

    let proposals = await this.service.viewAsync(criteria, projection, { lean: true });

    proposals = proposals.filter(x => x.projectId && x.brandId);

    proposals = proposals.map(x => {

        if (x.projectId.hideBrandDetails) {
            const newObj = {
                _id: x.serviceProviderId._id,
                businessName: "Private Client",
                description: ""
            }
            x.serviceProviderId = newObj;
        }

        return x;

    })

    return proposals;

}

ProposalsController.prototype.getProposalsListForBrand = async function getProposalsListForBrand(data) {

    const criteria = {
        brandId: data.userData._id,
        projectId: data.payload.projectId,
        isDeleted: false,
        status: { $ne: Config.APP_CONSTANTS.DATABASE_KEYS.proposalStatus.withdrawn },
        population: [{ path: "projectId", select: "name briefType objective hideBrandDetails", match: { isDeleted: false } }, { path: "brandId", select: "businessName logo description" }, { path: "serviceProviderId", select: "businessName logo description languagesSpoken locationsInChina foundingHistory", match: { isDeleted: false } }]
    };

    const projection = { isArchived: 0, isDeleted: 0 };

    let proposals = await this.service.viewAsync(criteria, projection, { lean: true, sort: { createdAt: -1 } });

    proposals = proposals.filter(x => x.projectId && x.serviceProviderId);

    const ids = proposals.map(x => x.serviceProviderId._id);

    const shortlistCriteria = { projectId: data.payload.projectId, brandId: data.userData._id, serviceProviderId: { $in: ids }, isDeleted: false };

    const shortlisted = await Service.makeModule.shortlistedServiceProviders.viewAsync(shortlistCriteria, {}, { lean: true });

    const shortlistedProviders = shortlisted.map(x => x.serviceProviderId.toString());

    const shortlistedProposals = [];
    const otherProposals = [];

    proposals.forEach(x => {
        const sp = _.clone(x.serviceProviderId);
        sp.isShortlisted = shortlistedProviders.indexOf(sp._id.toString()) > -1 ? true : false;
        x.serviceProviderId = sp;

        if (sp.isShortlisted) {
            shortlistedProposals.push(x);
        } else {
            otherProposals.push(x);
        }

        // return x;
    })

    const proposalList = shortlistedProposals.concat(otherProposals);

    return proposalList;

}

ProposalsController.prototype.getProposalDetails = async function getProposalDetails(data) {

    const criteria = {
        _id: data.payload._id,
        isDeleted: false,
        population: [{ path: "projectId", select: "name briefType objective" }, { path: "brandId", select: "businessName logo description email" }, { path: "serviceProviderId", select: "businessName logo description email" }]
    };

    if (data.userData.userRole === Config.APP_CONSTANTS.DATABASE_KEYS.userRole.brand) {
        criteria.brandId = data.userData._id;
    } else {
        criteria.serviceProviderId = data.userData._id;
    }

    const projection = { isArchived: 0, isDeleted: 0 };

    const proposal = await this.service.viewAsyncById(criteria, projection, { lean: true, limit: 1 });

    if (proposal.status === Config.APP_CONSTANTS.DATABASE_KEYS.proposalStatus.hired) {
        const hirings = await Service.makeModule.hirings.viewAsync({ proposalId: proposal._id }, {}, { lean: true, limit: 1 });
        proposal.hiringDetails = hirings[0];
    }

    const invoices = await Service.makeModule.invoices.viewAsync({ proposalId: proposal._id, isDeleted: false }, {}, { lean: true, limit: 1, sort: { createdAt: -1 } });

    proposal.invoice = invoices[0] || null;

    return proposal;

}

ProposalsController.prototype.updateProposalStatus = async function updateProposalStatus(data) {

    const criteria = {
        _id: data.payload._id,
        brandId: data.userData._id,
        isDeleted: false
    };

    const proposal = await this.service.viewAsyncById(criteria, {}, { lean: true, limit: 1 });

    const updateProposal = await this.service.editAsync(criteria, { status: data.payload.status }, { new: true });

    const project = await Service.makeModule.projects.editAsync({_id: proposal.projectId}, {status: Config.APP_CONSTANTS.DATABASE_KEYS.projectStatus.completed}, {});

    return updateProposal;

}

ProposalsController.prototype.updateProposalDetails = async function updateProposalDetails(data) {

    const criteria = {
        _id: data.payload._id,
        serviceProviderId: data.userData._id,
        isDeleted: false,
        population: [{ path: "brandId" }, { path: "projectId" }]
    };

    const proposal = await this.service.viewAsyncById(criteria, {}, { lean: true, limit: 1 });

    if (proposal.status === Config.APP_CONSTANTS.DATABASE_KEYS.proposalStatus.hired) {
        return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.CANT_UPDATE_PROPOSAL_AFTER_HIRED)
    }

    const objToSave = _.clone(data.payload);

    const historyObj = {
        editAt: new Date(),
        editBy: data.userData._id,
        payload: _.clone(data.payload),
        oldData: _.clone(proposal),
        editByAdmin: false
    }

    objToSave["$push"] = { editHistory: historyObj };

    const updateProposal = await this.service.editAsync(criteria, objToSave, { new: true });

    const proposalEmail = await this.sendProposalEmailToBrand(proposal.brandId, data.userData, proposal.projectId, "proposalUpdated");

    sendProposalNotificationToBrand(proposal.brandId, data.userData, proposal.projectId, updateProposal, "UPDATED_PROPOSAL_RECEIVED");

    return updateProposal;

}

async function updateSentProposalCountForSP(serviceProviderId) {

    const proposalCount = await Service.makeModule.proposals.countAsync({ serviceProviderId: serviceProviderId, isDeleted: false });

    const user = await Service.makeModule.users.editAsync({ _id: serviceProviderId }, { applicationsCount: proposalCount }, {});

    return;

}

module.exports = {
    'proposals': new ProposalsController(Service.makeModule.proposals)
};;