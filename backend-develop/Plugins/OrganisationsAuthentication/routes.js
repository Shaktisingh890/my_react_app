
var accessControlListRoutes = require('./lib/Models/OrgAuthACL/OrgAuthACLRoutes').orgAuthACL.getRoutes()
var rolesRoutes = require('./lib/Models/OrgAuthRoles/OrgAuthRolesRoutes').orgAuthRoles.getRoutes() 
var apiPaths = require('./lib/Models/OrgAuthApis/OrgAuthApisRoutes').orgAuthApis.getRoutes()
var apiPermissions = require('./lib/Models/OrgAuthPermissions/OrgAuthPermissionsRoutes').orgAuthPermissions.getRoutes()

function routes (options) {

	var all = [];
all = all.concat(accessControlListRoutes , rolesRoutes , apiPermissions , apiPaths );
// console.log(rolesRoutes)

return all;

};


module.exports = routes;