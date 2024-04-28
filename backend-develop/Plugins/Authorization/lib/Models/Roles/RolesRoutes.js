var dependencies = require('../../../dependencies.js')

var routesModule = dependencies.routesModule;
var Controller = dependencies.Controller;
var UniversalFunctions = dependencies.UniversalFunctions;
var commonRoutes = dependencies.commonRoutes
var Joi = require('joi');

Controller.makeModule.roles = require('./RolesController').roles


var payload = {
maxBytes: 20000000,
parse: true,
output: 'file',
}

var schema = {
put: {
	_id : Joi.string(),
	name : Joi.string()

},
post: {
	name : Joi.string()

}
}


function RolesRoute(controller, requestSchema, mainKey, subKey , payload) {



// binding this controller with the controller in the p arent module i.e. routesModule
routesModule.call(this, controller, requestSchema, mainKey, subKey , payload);
}

RolesRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


RolesRoute.prototype.getParentRoutes = RolesRoute.prototype.getRoutes;
//RolesRoute.prototype.overridedParantFunction = RolesRoute.prototype.ParantFunction;


RolesRoute.prototype.newFunction = function(request, reply){


this.controller.anyController(request.params.id, commonRoutes.handleControllerResponseWithoutAuth.bind({
reply: reply,
request: request
}));

}

RolesRoute.prototype.getRoutes = function(request, reply) {

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
'roles': new RolesRoute(Controller.makeModule.roles, schema, 'admins', 'roles')
};