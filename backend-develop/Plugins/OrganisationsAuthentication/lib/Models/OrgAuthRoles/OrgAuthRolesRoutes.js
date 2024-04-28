var dependencies = require('../../../dependencies.js')

var routesModule = dependencies.routesModule;
var Controller = dependencies.Controller;
var UniversalFunctions = dependencies.UniversalFunctions;
var commonRoutes = dependencies.commonRoutes
var Joi = require('joi');

Controller.makeModule.orgAuthRoles = require('./OrgAuthRolesController').orgAuthRoles

var payload = {
maxBytes: 20000000,
parse: true,
output: 'file',
}

var schema = {
put: {

_id : Joi.string(),
	name : Joi.string(),
		permissions : Joi.array().items(Joi.string())

},
post: {

	name : Joi.string(),
	permissions : Joi.array().items(Joi.string())

}
}


function OrgAuthRolesRoute(controller, requestSchema, mainKey, subKey , payload) {



// binding this controller with the controller in the p arent module i.e. routesModule
routesModule.call(this, controller, requestSchema, mainKey, subKey , payload);

this.readApi = true;
this.createApi = true;
this.editApi = true;
this.getByIdApi = true;
this.deleteByIdApi = true;


}

OrgAuthRolesRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


OrgAuthRolesRoute.prototype.getParentRoutes = OrgAuthRolesRoute.prototype.getRoutes;
//OrgAuthRolesRoute.prototype.overridedParantFunction = OrgAuthRolesRoute.prototype.ParantFunction;


OrgAuthRolesRoute.prototype.newFunction = function(request, reply){


this.controller.anyController(request.params.id, commonRoutes.handleControllerResponseWithoutAuth.bind({
reply: reply,
request: request
}));

}

OrgAuthRolesRoute.prototype.getRoutes = function(request, reply) {

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
'orgAuthRoles': new OrgAuthRolesRoute(Controller.makeModule.orgAuthRoles, schema, 'admins', 'orgAuthRoles')
};