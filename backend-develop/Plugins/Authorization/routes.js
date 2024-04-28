
var accessControlListRoutes = require('./lib/Models/AccessControlList/AccessControlListRoutes').accessControlList.getRoutes()
var rolesRoutes = require('./lib/Models/Roles/RolesRoutes').roles.getRoutes() 
var apiPaths = require('./lib/Models/ApiPaths/ApiPathsRoutes').apiPaths.getRoutes()

function routes (options) {

	var all = [];
all = all.concat(accessControlListRoutes , rolesRoutes , apiPaths


	);
// console.log(rolesRoutes)

return all;

};


module.exports = routes;