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


function ExpanterConnectsRoute(controller, requestSchema, mainKey, subKey , payload) {



    //this.createApi = true;
    //this.editApi = true;
    //this.readApi = true;
    //this.getByIdApi = true;
    //this.deleteByIdApi = true;
    //this.getGraphsApi = true;



    // binding this controller with the controller in the p arent module i.e. routesModule
    routesModule.call(this, controller, requestSchema, mainKey, subKey , payload);
}

ExpanterConnectsRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


ExpanterConnectsRoute.prototype.getParentRoutes = ExpanterConnectsRoute.prototype.getRoutes;
//ExpanterConnectsRoute.prototype.overridedParantFunction = ExpanterConnectsRoute.prototype.ParantFunction;

ExpanterConnectsRoute.prototype.expanterConnects = function(request, reply) {

    let data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.payload;

    return commonRoutes.handlePromise(this.controller.expanterConnects(data));

}

ExpanterConnectsRoute.prototype.getRoutes = function(request, reply) {

    var seperator = '';
    if (this.apiName) {
        seperator = '/'
    }

    var newRoutes =[

    // You can write new routes here
    //

    {
            method: 'POST',
            path: `/v1/${this.apiName}`,
            handler: this.expanterConnects.bind(this),
            config: {
                auth: 'BrandAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    payload: Joi.object({
                        serviceProviderEmail: Joi.string().trim(),
                        otherDetails: Joi.string().description("stringified object").required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'expanter connect query from Brand to SP',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }



    ]


    return this.getParentRoutes().concat(newRoutes);
}

module.exports = {
    'expanterConnects': new ExpanterConnectsRoute(Controller.makeModule.expanterConnects, schema, 'admins', 'expanterConnects')
};
