var dependencies = require('../../../dependencies.js')

var routesModule = dependencies.routesModule;
var Controller = dependencies.Controller;
var UniversalFunctions = dependencies.UniversalFunctions;
var commonRoutes = dependencies.commonRoutes
var Joi = require('joi');

Controller.makeModule.permissions = require('./PermissionsController').permissions

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


function PermissionsRoute(controller, requestSchema, mainKey, subKey , payload) {



// binding this controller with the controller in the p arent module i.e. routesModule
routesModule.call(this, controller, requestSchema, mainKey, subKey , payload);
}

PermissionsRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


PermissionsRoute.prototype.getParentRoutes = PermissionsRoute.prototype.getRoutes;
//PermissionsRoute.prototype.overridedParantFunction = PermissionsRoute.prototype.ParantFunction;


PermissionsRoute.prototype.newFunction = function(request, reply){


this.controller.anyController(request.params.id, commonRoutes.handleControllerResponseWithoutAuth.bind({
reply: reply,
request: request
}));

}

PermissionsRoute.prototype.getRoutes = function(request, reply) {

var seperator = '';
if (this.apiName) {
seperator = '/'
}

var newRoutes =[ 

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
'permissions': new PermissionsRoute(Controller.makeModule.permissions, schema, 'admins', 'permissions')
};