var routesModule = require('../../Routes/RoutesModule').Routes;
var Controller = require('../../Controllers');
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var commonRoutes = require('../../Routes/commonRoutesThings');
var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

var payload = {
    maxBytes: 20000000,
    parse: true,
    output: 'file',
}

var schema = {
    put: {
        coverLetter: Joi.string().trim(),
        docs: Joi.array().items(Joi.object().keys({
            fileType: Joi.string().trim(),
            mimeType: Joi.string().trim(),
            original: Joi.string().trim().uri(),
            thumbnail: Joi.string().trim().uri(),
            _id: Joi.string(),
            name: Joi.string().trim()
        })),
        status: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.proposalStatus.server)
    },
    post: {

    }
}


function ProposalsRoute(controller, requestSchema, mainKey, subKey, payload) {



    //this.createApi = true;
    this.editApi = true;
    this.readApi = true;
    this.getByIdApi = true;
    this.deleteByIdApi = true;
    //this.getGraphsApi = true;



    // binding this controller with the controller in the p arent module i.e. routesModule
    routesModule.call(this, controller, requestSchema, mainKey, subKey, payload);
}

ProposalsRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


ProposalsRoute.prototype.getParentRoutes = ProposalsRoute.prototype.getRoutes;
//ProposalsRoute.prototype.overridedParantFunction = ProposalsRoute.prototype.ParantFunction;

ProposalsRoute.prototype.sendProposal = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.payload;

    return commonRoutes.handlePromise(this.controller.sendProposal(data));

}

ProposalsRoute.prototype.getProposalsListForServiceProvider = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.query || {};

    return commonRoutes.handlePromise(this.controller.getProposalsListForServiceProvider(data));

}

ProposalsRoute.prototype.getProposalsListForBrand = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.query;

    return commonRoutes.handlePromise(this.controller.getProposalsListForBrand(data));

}

ProposalsRoute.prototype.updateProposalStatus = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = { ...request.payload, ...request.params };

    return commonRoutes.handlePromise(this.controller.updateProposalStatus(data));

}

ProposalsRoute.prototype.getProposalDetails = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.params;

    return commonRoutes.handlePromise(this.controller.getProposalDetails(data));

}

ProposalsRoute.prototype.updateProposalDetails = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = { ...request.payload, ...request.params };

    return commonRoutes.handlePromise(this.controller.updateProposalDetails(data));

}

ProposalsRoute.prototype.getRoutes = function(request, reply) {

    var seperator = '';
    if (this.apiName) {
        seperator = '/'
    }

    var newRoutes = [

        // You can write new routes here
        //

        {
            method: 'POST',
            path: `/v1/${this.apiName}`,
            handler: this.sendProposal.bind(this),
            config: {
                auth: 'ServiceProviderAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    payload: Joi.object({
                        projectId: Joi.objectId().required(),
                        coverLetter: Joi.string().trim().required(),
                        docs: Joi.array().items(Joi.object().keys({
                            fileType: Joi.string().trim(),
                            mimeType: Joi.string().trim(),
                            original: Joi.string().trim().uri(),
                            thumbnail: Joi.string().trim().uri(),
                            name: Joi.string().trim()
                        })),
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'send proposal',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}/serviceProvider`,
            handler: this.getProposalsListForServiceProvider.bind(this),
            config: {
                auth: 'ServiceProviderAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'get list of proposal for service provider',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}/brand`,
            handler: this.getProposalsListForBrand.bind(this),
            config: {
                auth: 'BrandAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    query: Joi.object({
                        projectId: Joi.objectId().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'get list of proposal for brand',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}/{_id}`,
            handler: this.getProposalDetails.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'get details of proposal',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'PUT',
            path: `/v1/${this.apiName}/brand/{_id}`,
            handler: this.updateProposalStatus.bind(this),
            config: {
                auth: 'BrandAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    payload: Joi.object({
                        status: Joi.string().trim().required().valid(UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE_KEYS.proposalStatus.completed)
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'update proposal status by brand',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'PUT',
            path: `/v1/${this.apiName}/serviceProvider/{_id}`,
            handler: this.updateProposalDetails.bind(this),
            config: {
                auth: 'ServiceProviderAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    payload: Joi.object({
                        coverLetter: Joi.string().trim().required(),
                        docs: Joi.array().items(Joi.object().keys({
                            fileType: Joi.string().trim(),
                            mimeType: Joi.string().trim(),
                            original: Joi.string().trim().uri(),
                            thumbnail: Joi.string().trim().uri(),
                            _id: Joi.string(),
                            name: Joi.string().trim()
                        })),
                        // status: Joi.string().trim().valid(UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE_KEYS.proposalStatus.withdrawn)
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'update proposal status by service provider',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }



    ]


    return this.getParentRoutes().concat(newRoutes);
}

module.exports = {
    'proposals': new ProposalsRoute(Controller.makeModule.proposals, schema, 'admins', 'proposals')
};