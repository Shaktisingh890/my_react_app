var routesModule = require('../../Routes/RoutesModule').Routes;
var Controller = require('../../Controllers');
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var commonRoutes = require('../../Routes/commonRoutesThings');
var Joi = require('joi');

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


function AccessTokensRoute(controller, requestSchema, mainKey, subKey , payload) {



    // this.createApi = true;
    // this.editApi = true;
    // this.readApi = true;
    // this.getByIdApi = true;
    // this.deleteByIdApi = true;
    // this.getGraphsApi = true;



    // binding this controller with the controller in the p arent module i.e. routesModule
    routesModule.call(this, controller, requestSchema, mainKey, subKey , payload);
}

AccessTokensRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


AccessTokensRoute.prototype.getParentRoutes = AccessTokensRoute.prototype.getRoutes;
//AccessTokensRoute.prototype.overridedParantFunction = AccessTokensRoute.prototype.ParantFunction;


AccessTokensRoute.prototype.newFunction = function(request, reply){


     this.controller.anyController(request.params.id, commonRoutes.handleControllerResponseWithoutAuth.bind({
        reply: reply,
        request: request
    }));

}

AccessTokensRoute.prototype.getRoutes = function(request, reply) {

    var seperator = '';
    if (this.apiName) {
        seperator = '/'
    }

    var newRoutes =[

    // You can write new routes here
    //

    // {
    //     method: 'GET',
    //     path: '/api/' + this.apiName ,
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
    'accessTokens': new AccessTokensRoute(Controller.makeModule.accessTokens, schema, 'admins', 'accessTokens')
};
