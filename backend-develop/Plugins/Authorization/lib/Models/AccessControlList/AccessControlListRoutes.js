var dependencies = require('../../../dependencies.js')

var routesModule = dependencies.routesModule;
var Controller = dependencies.Controller;
var UniversalFunctions = dependencies.UniversalFunctions;
var commonRoutes = dependencies.commonRoutes
var Joi = require('joi');

Controller.makeModule.accessControlList = require('./AccessControlListController').accessControlList

var payload = {
maxBytes: 20000000,
parse: true,
output: 'file',
}

var schema = {
put: {
	_id : Joi.string(),
	roleId : Joi.string(),
	uiElementId : Joi.string(),
	model : Joi.string(),
	isAllow : Joi.boolean(),
	permission : Joi.string()
},
post: {
	roleId : Joi.string(),
	uiElementId : Joi.string(),
	model : Joi.string(),
	isAllow : Joi.boolean(),
	permission : Joi.string()

}
}


function AccessControlListRoute(controller, requestSchema, mainKey, subKey , payload) {



// binding this controller with the controller in the p arent module i.e. routesModule
routesModule.call(this, controller, requestSchema, mainKey, subKey , payload);
}

AccessControlListRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


AccessControlListRoute.prototype.getParentRoutes = AccessControlListRoute.prototype.getRoutes;
//AccessControlListRoute.prototype.overridedParantFunction = AccessControlListRoute.prototype.ParantFunction;


AccessControlListRoute.prototype.permissions = function(request, reply){

 var adminData = request.auth.credentials.adminData;

 console.log(adminData);

var payload = {
	criteria : {
		isAllow : true,
		roleId : adminData.roleId
	},
	projection : {},
	options : {}
}

this.controller.list(payload, function (err, data , statusMessage) {

console.log(err, data)

  if (!request.auth.isAuthenticated) {
    return reply('Authentication failed due to: ' + request.auth.error.message);
  }
  if (err) {
    reply(UniversalFunctions.sendError(err));
  } else {


	var permissionsObj = {
		permissions : data,
		isSuperDuperAdmin : adminData.isSuperDuperAdmin
	}


    reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, permissionsObj)).code(201)
  }
})

}

AccessControlListRoute.prototype.getRoutes = function(request, reply) {

var seperator = '';
if (this.apiName) {
seperator = '/'
}

var newRoutes =[ 
// {
//     method: 'GET',
//     path: '/v1/admins/permissions',
//     handler: this.permissions.bind(this),
    
//     config: {
//     	auth: 'AdminAuth',
//         validate: {
//         	 headers: UniversalFunctions.authorizationHeaderObj,
//         },
//         description: 'get permissions',
//         tags: ['api', this.moduleName],
//         plugins: commonRoutes.routesPlugin
//     }
// }
]


return this.getParentRoutes().concat(newRoutes);
}

module.exports = {
'accessControlList': new AccessControlListRoute(Controller.makeModule.accessControlList, schema, 'admins', 'accessControlList')
};