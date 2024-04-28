var dependencies = require('../../../dependencies.js')

var routesModule = dependencies.routesModule;
var Controller = dependencies.Controller;
var UniversalFunctions = dependencies.UniversalFunctions;
var commonRoutes = dependencies.commonRoutes
var Joi = require('joi');

Controller.makeModule.apiPaths = require('./ApiPathsController').apiPaths

var payload = {
    maxBytes: 20000000,
    parse: true,
    output: 'file',
}

var schema = {
    put: {
        _id: Joi.string(),
        method: Joi.string(),
        path: Joi.string(),
        allow : Joi.array(),
        isPublic : Joi.boolean()

    },
    post: {
        method: Joi.string(),
        path: Joi.string(),
        allow:Joi.array(),
        isPublic : Joi.boolean()


    }
}


function ApiPathsRoute(controller, requestSchema, mainKey, subKey, payload) {



    // binding this controller with the controller in the p arent module i.e. routesModule
    routesModule.call(this, controller, requestSchema, mainKey, subKey, payload);
}

ApiPathsRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


ApiPathsRoute.prototype.getParentRoutes = ApiPathsRoute.prototype.getRoutes;
//ApiPathsRoute.prototype.overridedParantFunction = ApiPathsRoute.prototype.ParantFunction;


ApiPathsRoute.prototype.newFunction = function(request, reply) {


    this.controller.anyController(request.params.id, commonRoutes.handleControllerResponseWithoutAuth.bind({
        reply: reply,
        request: request
    }));

}

ApiPathsRoute.prototype.getRoutes = function(request, reply) {

    var seperator = '';
    if (this.apiName) {
        seperator = '/'
    }

    var newRoutes = [

        // You can write new routes here
        // 

        // {
        //     method: 'GET',
        //     path: '/v1/' + this.apiName ,
        //     handler: this.newFunction.bind(this),
        //     config: {
        //         validate: {
        //             query: {
        //             }

        //         },
        //         description: 'get a module by its id',
        //         tags: ['api', this.moduleName],
        //         plugins: commonRoutes.routesPlugin
        //     }
        // }



    ]


    return this.getParentRoutes().concat(newRoutes);
}

module.exports = {
    'apiPaths': new ApiPathsRoute(Controller.makeModule.apiPaths, schema, 'admins', 'apiPaths')
};
