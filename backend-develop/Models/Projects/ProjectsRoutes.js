var routesModule = require('../../Routes/RoutesModule').Routes;
var Controller = require('../../Controllers');
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var commonRoutes = require('../../Routes/commonRoutesThings');
var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const fs = require('fs');


var payload = {
    maxBytes: 20000000,
    parse: true,
    output: 'file',
}

var schema = {
    put: {
        name: Joi.string().trim(),
        hideBrandDetails: Joi.boolean(),
        briefType: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.projectBriefingTypes.server),
        brandOverview: Joi.string().trim(),
        projectOverview: Joi.string().trim(),
        wayOfOperation: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.wayOfOperations.server)),
        objective: Joi.array().items(Joi.string().trim()),
        requirements: Joi.object().keys({
            industryExperience: Joi.array().items(Joi.string().trim()).required(),
            segmentExperience: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.segmentExperience.server)),
            languageSpoken: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.languageSpoken.server)),
            teamSize: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.teamSizeRequirements.server),
            experience: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.requiredExperience.server),
            chinaOfficeLocation: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.chinaCities.server)),
        }),
        budgetTypes: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.budgetTypes.server)),
        budget: Joi.object().keys({
            retainerBased: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.projectStartingFee_USD.server),
            projectBased: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.projectStartingFee_USD.server),
        }),
        startingTimeline: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.startingTimeline.server),
        isPublished: Joi.boolean(),
        isPublic: Joi.boolean(),
        docs: Joi.array().items(Joi.object().keys({
            fileType: Joi.string().trim(),
            mimeType: Joi.string().trim(),
            original: Joi.string().trim().uri(),
            thumbnail: Joi.string().trim().uri(),
            name: Joi.string().trim(),
            _id: Joi.objectId()
        })),
        notes: Joi.string().allow("")
    },
    post: {

    }
}


function ProjectsRoute(controller, requestSchema, mainKey, subKey, payload) {



    // this.createApi = true;
    this.editApi = true;
    this.readApi = true;
    this.getByIdApi = true;
    this.deleteByIdApi = true;
    // this.getGraphsApi = true;



    // binding this controller with the controller in the p arent module i.e. routesModule
    routesModule.call(this, controller, requestSchema, mainKey, subKey, payload);
}

ProjectsRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


ProjectsRoute.prototype.getParentRoutes = ProjectsRoute.prototype.getRoutes;
//ProjectsRoute.prototype.overridedParantFunction = ProjectsRoute.prototype.ParantFunction;

ProjectsRoute.prototype.createNewProjectBrief = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.payload;

    return commonRoutes.handlePromise(this.controller.createNewProjectBrief(data));

}

ProjectsRoute.prototype.updateProjectBrief = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = { ...request.payload, ...request.params };

    return commonRoutes.handlePromise(this.controller.updateProjectBrief(data));

}

ProjectsRoute.prototype.getProjectBriefs = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.query || {};

    return commonRoutes.handlePromise(this.controller.getProjectBriefs(data));

}

ProjectsRoute.prototype.getPublishedProjects = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.query || {};

    return commonRoutes.handlePromise(this.controller.getPublishedProjects(data));

}

ProjectsRoute.prototype.getProjectDetails = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.params;

    return commonRoutes.handlePromise(this.controller.getProjectDetails(data));

}

ProjectsRoute.prototype.deleteProjectDetails = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.params;

    return commonRoutes.handlePromise(this.controller.deleteProjectDetails(data));

}

ProjectsRoute.prototype.getServiceProvidersForProject = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = { ...request.query, ...request.params };

    return commonRoutes.handlePromise(this.controller.getServiceProvidersForProject(data));

}

ProjectsRoute.prototype.downloadProjectBrief = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.params;

    // return commonRoutes.handlePromise(this.controller.downloadProjectBrief(data));

    return this.controller.downloadProjectBrief(data).then((response) => {

        const fileToSend = fs.readFileSync(response.filename);

        const fileName = "project-brief.pdf"

        return reply.response(fileToSend)
            .bytes(fileToSend.length)
            .type('application/pdf')
            .header('content-disposition', fileName);

    }).catch((err) => {

        console.log(err);

        return UniversalFunctions.sendError(err, null, reply);

    })

}

ProjectsRoute.prototype.downloadProjectBriefFromAdmin = function(request, reply) {

    var data = {};

    data.adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;

    data.payload = request.params;

    // return commonRoutes.handlePromise(this.controller.downloadProjectBrief(data));

    return this.controller.downloadProjectBriefFromAdmin(data).then((response) => {

        const fileToSend = fs.readFileSync(response.filename);

        const fileName = "project-brief.pdf"

        return reply.response(fileToSend)
            .bytes(fileToSend.length)
            .type('application/pdf')
            .header('content-disposition', fileName);

    }).catch((err) => {

        console.log(err);

        return reply.response(UniversalFunctions.sendError(err));

    })

}

ProjectsRoute.prototype.getRoutes = function(request, reply) {

    var seperator = '';
    if (this.apiName) {
        seperator = '/'
    }

    var newRoutes = [

        {
            method: 'POST',
            path: `/v1/${this.apiName}`,
            handler: this.createNewProjectBrief.bind(this),
            config: {
                auth: 'BrandAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    payload: Joi.object({
                        name: Joi.string().trim().required(),
                        hideBrandDetails: Joi.boolean(),
                        briefType: Joi.string().trim().required().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.projectBriefingTypes.server),
                        brandOverview: Joi.string().trim().required(),
                        projectOverview: Joi.string().trim(),
                        wayOfOperation: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.wayOfOperations.server)),
                        objective: Joi.array().items(Joi.string().trim()).required(),
                        requirements: Joi.object().keys({
                            industryExperience: Joi.array().items(Joi.string().trim()).required(),
                            segmentExperience: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.segmentExperience.server)).required(),
                            languageSpoken: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.languageSpoken.server)).required(),
                            teamSize: Joi.string().trim().required().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.teamSizeRequirements.server),
                            experience: Joi.string().trim().required().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.requiredExperience.server),
                            chinaOfficeLocation: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.chinaCities.server)).required(),
                        }),
                        budgetTypes: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.budgetTypes.server)).required(),
                        budget: Joi.object().keys({
                            retainerBased: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.projectStartingFee_USD.server),
                            projectBased: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.projectStartingFee_USD.server),
                        }),
                        startingTimeline: Joi.string().trim().required().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.startingTimeline.server),
                        docs: Joi.array().items(Joi.object().keys({
                            fileType: Joi.string().trim(),
                            mimeType: Joi.string().trim(),
                            original: Joi.string().trim().uri(),
                            thumbnail: Joi.string().trim().uri(),
                            name: Joi.string().trim()
                        })),
                        notes: Joi.string().allow("")
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'create a project brief',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'PUT',
            path: `/v1/${this.apiName}/{_id}`,
            handler: this.updateProjectBrief.bind(this),
            config: {
                auth: 'BrandAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    payload: Joi.object({
                        name: Joi.string().trim(),
                        hideBrandDetails: Joi.boolean(),
                        briefType: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.projectBriefingTypes.server),
                        brandOverview: Joi.string().trim(),
                        projectOverview: Joi.string().trim(),
                        wayOfOperation: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.wayOfOperations.server)),
                        objective: Joi.array().items(Joi.string().trim()),
                        requirements: Joi.object().keys({
                            industryExperience: Joi.array().items(Joi.string().trim()).required(),
                            segmentExperience: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.segmentExperience.server)),
                            languageSpoken: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.languageSpoken.server)),
                            teamSize: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.teamSizeRequirements.server),
                            experience: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.requiredExperience.server),
                            chinaOfficeLocation: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.chinaCities.server)),
                        }),
                        budgetTypes: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.budgetTypes.server)),
                        budget: Joi.object().keys({
                            retainerBased: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.projectStartingFee_USD.server),
                            projectBased: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.projectStartingFee_USD.server),
                        }),
                        startingTimeline: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.startingTimeline.server),
                        isPublished: Joi.boolean(),
                        isPublic: Joi.boolean(),
                        docs: Joi.array().items(Joi.object().keys({
                            fileType: Joi.string().trim(),
                            mimeType: Joi.string().trim(),
                            original: Joi.string().trim().uri(),
                            thumbnail: Joi.string().trim().uri(),
                            name: Joi.string().trim(),
                            _id: Joi.objectId()
                        })),
                        notes: Joi.string().allow(""),
                        status: Joi.string()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'create a project brief',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}/briefs`,
            handler: this.getProjectBriefs.bind(this),
            config: {
                auth: 'BrandAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    query: Joi.object({
                        briefType: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.projectBriefingTypes.server)
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'get project briefs list',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}`,
            handler: this.getPublishedProjects.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    query: Joi.object({
                        briefType: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.projectBriefingTypes.server)
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'get published project list',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}/{_id}`,
            handler: this.getProjectDetails.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'get published project or brief details',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'DELETE',
            path: `/v1/${this.apiName}/{_id}`,
            handler: this.deleteProjectDetails.bind(this),
            config: {
                auth: 'BrandAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'delete published project or brief details',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}/{_id}/serviceProviders`,
            handler: this.getServiceProvidersForProject.bind(this),
            config: {
                auth: 'BrandAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    query: Joi.object({
                        mainSpecialities: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.mainSpecialities.server)),
                        // additionalCapacities: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.mainSpecialities.server)).description("Other Specialities"),
                        locationsInChina: Joi.array().items(Joi.string().trim()),
                        languagesSpoken: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.languageSpoken.server)),
                        staffSize: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.staffSize.server),
                        industryExperience: Joi.array().items(Joi.string().trim()),
                        // segmentExperience: Joi.array().items(Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.segmentExperience.server)),
                        budgetRetainerBased: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.projectStartingFee_USD.server),
                        budgetProjectBased: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.projectStartingFee_USD.server),
                        foundingHistory: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.foundingHistory.server),
                        // annualTurnover: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.annualTurnover.server)
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'get recommended service providers for a project',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}/{_id}/share`,
            handler: this.downloadProjectBrief.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'dowbload project brief',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/admin/${this.apiName}/{_id}/share`,
            handler: this.downloadProjectBriefFromAdmin.bind(this),
            config: {
                auth: 'AdminAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'dowbload project brief',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }


    ]


    return this.getParentRoutes().concat(newRoutes);
}

module.exports = {
    'projects': new ProjectsRoute(Controller.makeModule.projects, schema, 'admins', 'projects')
};