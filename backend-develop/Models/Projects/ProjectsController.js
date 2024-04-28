var Service = require('../../Services');
var Models = require('../../Models');
var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var controllerHelper = require('../../Controllers/commonControllerFunctions');
var Config = require('../../constant');

const config = require("config");
const Handlebars = require('handlebars');
// const pdf = require('html-pdf');
const pdf = require('html-pdf-node');
const fs = require('fs');

const axios = require('axios');
var NotificationManager = require('../../Lib/NotificationManager');

function startSection(sectionName) {

    console.log('=====================' + sectionName + '===================')
}


function ProjectsController(service) {


    //console.log('============================================ProjectsController controller initialised')
    ControllerModule.call(this, service);

}

ProjectsController.prototype = Object.create(ControllerModule.prototype)

ProjectsController.prototype.createNewProjectBrief = async function createNewProjectBrief(data) {

    const objToSave = data.payload;

    objToSave.brandId = data.userData._id;
    objToSave.isPublished = true;

    const project = await this.service.addAsync(objToSave);

    updateCreatedProjectCountForBrand(data.userData._id);

    const projectEmail = await this.sendProjectEmailToAdmin(data.userData, project, "projectCreationEmailToAdmin");

    return project;

}

ProjectsController.prototype.sendProjectEmailToAdmin = function sendProjectEmailToAdmin(brand, project, template) {

    return new Promise((resolve, reject) => {

        const obj = {
            brandName: brand.businessName,
            projectName: project.name,
            projectUrl: config.get("webUrl").adminProjectDetailUrl + "" + project._id
        }

        const emailObj = {
            title: template,
            handlebarData: obj,
            email: "hello@expanter.com"
        }

        NotificationManager.sendEmailToUser(emailObj, (err, res) => {

            console.log("sendProjectEmailToAdmin===>", err, res);

            resolve({});

        })

    })

}

ProjectsController.prototype.updateProjectBrief = async function updateProjectBrief(data) {

    const criteria = { _id: data.payload._id, brandId: data.userData._id, isDeleted: false };

    const project = await this.service.viewAsyncById(criteria, {}, { lean: true, limit: 1 });

    delete data.payload.status;

    const updatedProject = await this.service.editAsync(criteria, data.payload, { new: true });

    const projectEmail = await this.sendProjectEmailToAdmin(data.userData, updatedProject, "projectUpdationEmailToAdmin");

    return updatedProject;

}

ProjectsController.prototype.getProjectBriefs = async function getProjectBriefs(data) {

    const criteria = { brandId: data.userData._id, isDeleted: false, population: { path: "brandId", select: "businessName description industryExperience logo mainSpecialities" } };

    if (data.payload.briefType) {
        criteria.briefType = data.payload.briefType;
    }

    const options = { lean: true, sort: { createdAt: -1 } }

    const briefs = await this.service.viewAsync(criteria, {}, options);

    return briefs;

}

ProjectsController.prototype.getPublishedProjects = async function getPublishedProjects(data) {

    let criteria = { isPublished: true, isDeleted: false, population: { path: "brandId", select: "businessName logo description industryExperience mainSpecialities" } };

    if (data.userData.userRole === Config.APP_CONSTANTS.DATABASE_KEYS.userRole.brand) {
        criteria.brandId = data.userData._id
    }

    if (data.payload.briefType) {
        criteria.briefType = data.payload.briefType;
    }

    const options = { lean: true, sort: { createdAt: -1 } }

    let projects = await this.service.viewAsync(criteria, {}, options);

    if (data.userData.userRole === Config.APP_CONSTANTS.DATABASE_KEYS.userRole.serviceProvider) {
        projects = projects.map(x => {

            if (x.hideBrandDetails) {
                const newObj = {
                    _id: x._id,
                    businessName: "Private Client",
                    description: ""
                }
                x.brandId = newObj;
            }

            return x;

        })
    }

    return projects;

}

ProjectsController.prototype.getProjectDetails = async function getProjectDetails(data) {

    const criteria = { _id: data.payload._id, isDeleted: false, population: { path: "brandId", select: "businessName logo description industryExperience mainSpecialities" } };

    if (data.userData.userRole === Config.APP_CONSTANTS.DATABASE_KEYS.userRole.brand) {
        criteria.brandId = data.userData._id;
    }
    // else {
    //     criteria.isPublished = true;
    // }

    const project = await this.service.viewAsyncById(criteria, {}, { lean: true, limit: 1 });

    if (data.userData.userRole === Config.APP_CONSTANTS.DATABASE_KEYS.userRole.serviceProvider && project.hideBrandDetails) {
        project.brandId.businessName = "Private Client";
        project.brandId.description = "";
        delete project.brandId.logo;
    }

    return project;

}

ProjectsController.prototype.deleteProjectDetails = async function deleteProjectDetails(data) {

    const criteria = { _id: data.payload._id, brandId: data.userData._id, isDeleted: false };

    const project = await this.service.viewAsyncById(criteria, {}, { lean: true, limit: 1 });

    const deletedProject = await this.service.editAsync(criteria, { isDeleted: true }, {});

    updateCreatedProjectCountForBrand(data.userData._id);

    const deleteProposals = await Service.makeModule.proposals.multiEditAsync({ projectId: data.payload._id }, { isDeleted: true }, { multi: true });

    return {};

}

ProjectsController.prototype.getServiceProvidersForProject = async function getServiceProvidersForProject(data) {

    let searchApiUrl = config.get("searchApiBaseUrl");

    const projectCriteria = { _id: data.payload._id, brandId: data.userData._id, isDeleted: false };

    const project = await this.service.viewAsyncById(projectCriteria, {}, { lean: true, limit: 1 });

    let obj = {};

    for (let key in data.payload) {
        obj[key] = UniversalFunctions.updateServerValuesToShow(data.payload[key], );
    }

    console.log(obj);

    searchApiUrl += "?core=";

    if (obj.mainSpecialities && obj.mainSpecialities.length) {
        searchApiUrl += UniversalFunctions.updateServerValuesToShow(obj.mainSpecialities[0], "mainSpecialities");
    }

    // if(obj.additionalCapacities && obj.additionalCapacities.length) {
    //     searchApiUrl += `&add1=${UniversalFunctions.updateServerValuesToShow(data.payload.additionalCapacities[0], "mainSpecialities") || ""}`;
    //     searchApiUrl += `&add2=${UniversalFunctions.updateServerValuesToShow(data.payload.additionalCapacities[1], "mainSpecialities") || ""}`;
    // } else {
    //     searchApiUrl += `&add1=&add2=`;
    // }

    searchApiUrl += `&add1=&add2=`;

    if (obj.industryExperience && obj.industryExperience.length) {
        searchApiUrl += `&industry1=${UniversalFunctions.updateServerValuesToShow(obj.industryExperience[0], "industryExperience") || ""}`;
        searchApiUrl += `&industry2=${UniversalFunctions.updateServerValuesToShow(obj.industryExperience[1], "industryExperience") || ""}`;
        searchApiUrl += `&industry3=${UniversalFunctions.updateServerValuesToShow(obj.industryExperience[2], "industryExperience") || ""}`;
    } else {
        searchApiUrl += `&industry1=&industry2=&industry3=`;
    }

    searchApiUrl += "&segment=";

    // if(obj.segmentExperience && obj.segmentExperience.length) {
    //     searchApiUrl += `${UniversalFunctions.updateServerValuesToShow(obj.segmentExperience[0], "segmentExperience")}`;
    // }

    searchApiUrl += "&year=";

    if (obj.foundingHistory) {
        searchApiUrl += `${UniversalFunctions.updateServerValuesToShow(obj.foundingHistory, "foundingHistory")}`;
    }

    searchApiUrl += "&location=";

    if (obj.locationsInChina) {
        searchApiUrl += `${UniversalFunctions.updateServerValuesToShow(obj.locationsInChina, "chinaProvinces").toString()}`;
    }

    searchApiUrl += "&language=";

    if (obj.languagesSpoken) {
        searchApiUrl += `${UniversalFunctions.updateServerValuesToShow(obj.languagesSpoken, "languageSpoken").toString()}`;
    }

    searchApiUrl += "&retainer=";

    if (obj.budgetRetainerBased) {
        searchApiUrl += `${UniversalFunctions.updateServerValuesToShow(obj.budgetRetainerBased, "projectStartingFee_USD")}`;
    }

    searchApiUrl += "&project=";

    if (obj.budgetProjectBased) {
        searchApiUrl += `${UniversalFunctions.updateServerValuesToShow(obj.budgetProjectBased, "projectStartingFee_USD")}`;
    }

    console.log(searchApiUrl);

    let response = await axios.get(searchApiUrl);

    const searchData = response && response.data ? response.data : null;

    let signedUpUsers = [];
    let nonSignedUpUsers = [];

    if(searchData && searchData.signed_up) {
        signedUpUsers = await searchData.signed_up.map(x => x.id);
    }

    if(searchData && searchData.not_signed_up) {
        nonSignedUpUsers = await searchData.not_signed_up.map(x => {
            x.isSignedUp = false;
            return x;
        })
    }

    let serviceProviders = [];

    if(signedUpUsers.length) {

        const userCriteria = { _id: { $in: signedUpUsers }, isDeleted: false, stepsCompleted: 0, userRole: Config.APP_CONSTANTS.DATABASE_KEYS.userRole.serviceProvider };

        serviceProviders = await Service.makeModule.users.viewAsync(userCriteria, { password: 0 }, { lean: true });

        if (serviceProviders.length) {

            const ids = serviceProviders.map(x => x._id);

            const shortlistCriteria = { projectId: data.payload._id, brandId: data.userData._id, serviceProviderId: { $in: ids }, isDeleted: false };

            const shortlisted = await Service.makeModule.shortlistedServiceProviders.viewAsync(shortlistCriteria, {}, { lean: true });

            const shortlistedProviders = shortlisted.map(x => x.serviceProviderId.toString());

            console.log(shortlisted, shortlistedProviders);

            serviceProviders.forEach(x => {
                x.isShortlisted = shortlistedProviders.indexOf(x._id.toString()) > -1 ? true : false;
                x.isSignedUp = true;
                return x;
            })

        }
    }

    serviceProviders = serviceProviders.concat(nonSignedUpUsers);

    return serviceProviders;

}

ProjectsController.prototype.downloadProjectBriefFromAdmin = async function downloadProjectBriefFromAdmin(data) {

    const criteria = { _id: data.payload._id, isDeleted: false, population: { path: "brandId", select: "businessName description logo industryExperience" } };

    const project = await this.service.viewAsyncById(criteria, {}, { lean: true, limit: 1 });

    const obj = await prepareDataForProjectBriefPDF(project, false);

    const htmlTemplate = Config.APP_CONSTANTS.PDF_TEMPLATES.shareProject.body;

    const updatedHtml = Handlebars.compile(htmlTemplate)(obj);

    const pdfOptions = {
        format: 'A4',
        path: "../../project-brief-1.pdf",
        args: ["--no-sandbox"],
        printBackground: true,
        margin: {
            bottom: "50px",
            top: "30px"
        }

    }

    const fileObj = await createPdfFromHTML(updatedHtml, pdfOptions, "../../project-brief-1.pdf");

    return fileObj;

}


function prepareDataForProjectBriefPDF(project, hideBrandDetails) {

    return new Promise((resolve, reject) => {
        let budgetArr = [];

        project.budgetTypes.forEach(x => {
            if (x === Config.APP_CONSTANTS.DATABASE_KEYS.budgetTypes.retainerBased) {
                const budgetStr = `${Config.APP_CONSTANTS.DATABASE.budgetTypes.retainerBased}: ${UniversalFunctions.updateServerValuesToShow(project.budget.retainerBased, "projectStartingFee_USD")}`;
                budgetArr.push(budgetStr);
            } else if (x === Config.APP_CONSTANTS.DATABASE_KEYS.budgetTypes.projectBased) {
                const budgetStr = `${Config.APP_CONSTANTS.DATABASE.budgetTypes.projectBased}: ${UniversalFunctions.updateServerValuesToShow(project.budget.projectBased, "projectStartingFee_USD")}`;
                budgetArr.push(budgetStr);
            }
        })

        const brandLogoUrl = (project.brandId.logo && project.brandId.logo.original) ? project.brandId.logo.original : config.get("sampleBusinessLogo");

        const briefType = UniversalFunctions.updateServerValuesToShow(project.briefType, "projectBriefingTypes");

        const wayOfOperation = UniversalFunctions.updateServerValuesToShow(project.wayOfOperation, "wayOfOperations")

        const objective = (project.objective && project.objective != "") ? project.objective : "No content"

        const teamSize = (project.requirements.teamSize && project.requirements.teamSize != "") ? UniversalFunctions.updateServerValuesToShow(project.requirements.teamSize, "teamSizeRequirements") : "No content";

        const experience = (project.requirements.experience && project.requirements.experience != "") ? UniversalFunctions.updateServerValuesToShow(project.requirements.experience, "requiredExperience") : "No content";

        const industryExperience = (project.requirements.industryExperience && project.requirements.industryExperience.length) ? UniversalFunctions.updateServerValuesToShow(project.requirements.industryExperience, "industryExperience") : ["No content"];

        const segmentExperience = (project.requirements.segmentExperience && project.requirements.segmentExperience.length) ? UniversalFunctions.updateServerValuesToShow(project.requirements.segmentExperience, "segmentExperience") : ["No content"];

        const budgetTypes = (project.budgetTypes && project.budgetTypes.length) ? UniversalFunctions.updateServerValuesToShow(project.budgetTypes, "budgetTypes") : ["No content"]

        const chinaOfficeLocation = (project.requirements.chinaOfficeLocation && project.requirements.chinaOfficeLocation.length) ? UniversalFunctions.updateServerValuesToShow(project.requirements.chinaOfficeLocation, "chinaProvinces") : ["No content"];

        const languageSpoken = (project.requirements.languageSpoken && project.requirements.languageSpoken.length) ? UniversalFunctions.updateServerValuesToShow(project.requirements.languageSpoken, "languageSpoken") : ["No content"];

        const brandOverview = (project.brandId.description && project.brandId.description != "") ? project.brandId.description : "No content";

        const projectOverview = (project.brandOverview && project.brandOverview != "") ? project.brandOverview : "No content";

        const brandIndustry = (project.brandId.industryExperience && project.brandId.industryExperience.length) ? UniversalFunctions.updateServerValuesToShow(project.brandId.industryExperience, "industryExperience") : ["No content"];

        const startingTimeline = (project.startingTimeline && project.startingTimeline != "") ? UniversalFunctions.updateServerValuesToShow(project.startingTimeline, "startingTimeline") : "No content";

        const obj = {
            brandName: project.brandId.businessName,
            brandOverview,
            brandLogoUrl,
            name: project.name,
            briefType,
            // wayOfOperation,
            objective,
            teamSize,
            experience,
            industryExperience,
            segmentExperience,
            budgetTypes,
            budgetArr,
            chinaOfficeLocation,
            languageSpoken,
            projectOverview,
            brandIndustry,
            startingTimeline
        }

        if (hideBrandDetails) {
            obj.brandName = "Private Client";
            // obj.brandOverview = "No content";
            obj.brandLogoUrl = config.get("sampleBusinessLogo");
        }

        return resolve(obj);
    })

}


ProjectsController.prototype.downloadProjectBrief = async function downloadProjectBrief(data) {

    const criteria = { _id: data.payload._id, isDeleted: false, population: { path: "brandId", select: "businessName description logo industryExperience" } };

    if (data.userData.userRole === Config.APP_CONSTANTS.DATABASE_KEYS.userRole.brand) {
        criteria.brandId = data.userData._id;
    } else {
        criteria.isPublished = true;
    }

    const project = await this.service.viewAsyncById(criteria, {}, { lean: true, limit: 1 });

    const obj = await prepareDataForProjectBriefPDF(project, project.hideBrandDetails);

    const htmlTemplate = Config.APP_CONSTANTS.PDF_TEMPLATES.shareProject.body;

    const updatedHtml = Handlebars.compile(htmlTemplate)(obj);

    const projectPath = `../../project-${project._id}.pdf`

    const pdfOptions = {
        format: 'A4',
        // displayHeaderFooter: true,
        // headerTemplate: `<div style="width:100%;background-color:#eee;" > <p class="pageNumber"> </p>  <p class="date"> </p> </div>`,
        // footerTemplate: `<div style="width:100%;background-color:#eee;"> <p class="pageNumber"> </p>  <p class="date"> </p> </div>`,
        path: projectPath,
        args: ["--no-sandbox"],
        printBackground: true,
        margin: {
            bottom: "50px",
            top: "30px"
        }

    }

    const fileObj = await createPdfFromHTML(updatedHtml, pdfOptions, projectPath);

    return fileObj;

}

function createPdfFromHTML(updatedHtml, pdfOptions, filepath) {

    return new Promise((resolve, reject) => {

        console.log("createPdfFromHTML==>")

        const pdfObj = { content: updatedHtml }

        pdf.generatePdf(pdfObj, pdfOptions).then((pdfBuffer) => {
                console.log(pdfBuffer); // { filename: '/app/businesscard.pdf' }
                // fs.writeFile(filepath, pdfBuffer, (err, res) => {
                //     if(err)
                //         reject();
                //     else
                //         resolve({filename: filepath});
                // })
                resolve({ filename: filepath });
            })
            .catch((err) => {
                console.log(err);
                reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SERVER_ERROR);
            })

    })

}

async function updateCreatedProjectCountForBrand(brandId) {

    const projectCount = await Service.makeModule.projects.countAsync({brandId: brandId, isDeleted: false});

    const user = await Service.makeModule.users.editAsync({_id: brandId}, {projectsCreated: projectCount}, {});

    return;

}

module.exports = {
    'projects': new ProjectsController(Service.makeModule.projects)
};;