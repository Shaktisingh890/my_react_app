var dependencies = require('../../../dependencies.js')

var routesModule = dependencies.routesModule;
var Controller = dependencies.Controller;
var UniversalFunctions = dependencies.UniversalFunctions;
var commonRoutes = dependencies.commonRoutes
var Joi = require('joi');

Controller.makeModule.orgAuthACL = require('./OrgAuthACLController').orgAuthACL

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


function OrgAuthACLRoute(controller, requestSchema, mainKey, subKey , payload) {



// binding this controller with the controller in the p arent module i.e. routesModule
routesModule.call(this, controller, requestSchema, mainKey, subKey , payload);
}

OrgAuthACLRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


OrgAuthACLRoute.prototype.getParentRoutes = OrgAuthACLRoute.prototype.getRoutes;
//OrgAuthACLRoute.prototype.overridedParantFunction = OrgAuthACLRoute.prototype.ParantFunction;


OrgAuthACLRoute.prototype.newFunction = function(request, reply){


this.controller.anyController(request.params.id, commonRoutes.handleControllerResponseWithoutAuth.bind({
reply: reply,
request: request
}));

}


OrgAuthACLRoute.prototype.permissions = function(request, reply){

 var adminData = request.auth.credentials.adminData;

var payload = {
	criteria : {
		isAllow : true,
		roleId : adminData.roleId
	},
	projection : {},
	options : {}
}

this.controller.list(payload, function (err, data , statusMessage) {

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

OrgAuthACLRoute.prototype.getRoutes = function(request, reply) {

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
// 
{
    method: 'GET',
    path: '/v1/manage/permissions',
    handler: this.permissions.bind(this),
    
    config: {
    	auth: 'OrgAdminAuth',
        validate: {
        	 headers: UniversalFunctions.authorizationHeaderObj,
        },
        description: 'get permissions',
        tags: ['api', this.moduleName],
        plugins: commonRoutes.routesPlugin
    }
}



]


return this.getParentRoutes().concat(newRoutes);
}

module.exports = {
'orgAuthACL': new OrgAuthACLRoute(Controller.makeModule.orgAuthACL, schema, 'admins', 'orgAuthACL')
};