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


function MessagesRoute(controller, requestSchema, mainKey, subKey , payload) {



    //this.createApi = true;
    //this.editApi = true;
    //this.readApi = true;
    //this.getByIdApi = true;
    //this.deleteByIdApi = true;
    //this.getGraphsApi = true;



    // binding this controller with the controller in the p arent module i.e. routesModule
    routesModule.call(this, controller, requestSchema, mainKey, subKey , payload);
}

MessagesRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


MessagesRoute.prototype.getParentRoutes = MessagesRoute.prototype.getRoutes;
//MessagesRoute.prototype.overridedParantFunction = MessagesRoute.prototype.ParantFunction;


MessagesRoute.prototype.newFunction = function(request, reply){


     this.controller.anyController(request.params.id, commonRoutes.handleControllerResponseWithoutAuth.bind({
        reply: reply,
        request: request
    }));

}

MessagesRoute.prototype.getRoutes = function(request, reply) {

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
    'messages': new MessagesRoute(Controller.makeModule.messages, schema, 'admins', 'messages')
};
