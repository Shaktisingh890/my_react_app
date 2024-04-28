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


function AclAndPathsRelationRoute(controller, requestSchema, mainKey, subKey , payload) {



// binding this controller with the controller in the p arent module i.e. routesModule
routesModule.call(this, controller, requestSchema, mainKey, subKey , payload);
}

AclAndPathsRelationRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


AclAndPathsRelationRoute.prototype.getParentRoutes = AclAndPathsRelationRoute.prototype.getRoutes;
//AclAndPathsRelationRoute.prototype.overridedParantFunction = AclAndPathsRelationRoute.prototype.ParantFunction;


AclAndPathsRelationRoute.prototype.newFunction = function(request, reply){


this.controller.anyController(request.params.id, commonRoutes.handleControllerResponseWithoutAuth.bind({
reply: reply,
request: request
}));

}

AclAndPathsRelationRoute.prototype.getRoutes = function(request, reply) {

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
'aclAndPathsRelation': new AclAndPathsRelationRoute(Controller.makeModule.aclAndPathsRelation, schema, 'admins', 'aclAndPathsRelation')
};