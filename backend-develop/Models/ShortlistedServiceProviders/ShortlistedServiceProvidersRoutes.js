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

    },
    post: {

    }
}


function ShortlistedServiceProvidersRoute(controller, requestSchema, mainKey, subKey, payload) {



    //this.createApi = true;
    //this.editApi = true;
    //this.readApi = true;
    //this.getByIdApi = true;
    //this.deleteByIdApi = true;
    //this.getGraphsApi = true;



    // binding this controller with the controller in the p arent module i.e. routesModule
    routesModule.call(this, controller, requestSchema, mainKey, subKey, payload);
}

ShortlistedServiceProvidersRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


ShortlistedServiceProvidersRoute.prototype.getParentRoutes = ShortlistedServiceProvidersRoute.prototype.getRoutes;
//ShortlistedServiceProvidersRoute.prototype.overridedParantFunction = ShortlistedServiceProvidersRoute.prototype.ParantFunction;


ShortlistedServiceProvidersRoute.prototype.shortlistServiceProvider = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.payload;

    return commonRoutes.handlePromise(this.controller.shortlistServiceProvider(data));

}

ShortlistedServiceProvidersRoute.prototype.removeShortlistedServiceProvider = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.params;

    return commonRoutes.handlePromise(this.controller.removeShortlistedServiceProvider(data));

}

ShortlistedServiceProvidersRoute.prototype.getRoutes = function(request, reply) {

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
            handler: this.shortlistServiceProvider.bind(this),
            config: {
                auth: 'BrandAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    payload: Joi.object({
                        projectId: Joi.objectId().required(),
                        serviceProviderId: Joi.objectId().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'shortlist service provider',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'DELETE',
            path: `/v1/${this.apiName}/{projectId}/{serviceProviderId}`,
            handler: this.removeShortlistedServiceProvider.bind(this),
            config: {
                auth: 'BrandAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        projectId: Joi.objectId().required(),
                        serviceProviderId: Joi.objectId().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'remove shortlisted service provider',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }



    ]


    return this.getParentRoutes().concat(newRoutes);
}

module.exports = {
    'shortlistedServiceProviders': new ShortlistedServiceProvidersRoute(Controller.makeModule.shortlistedServiceProviders, schema, 'admins', 'shortlistedServiceProviders')
};