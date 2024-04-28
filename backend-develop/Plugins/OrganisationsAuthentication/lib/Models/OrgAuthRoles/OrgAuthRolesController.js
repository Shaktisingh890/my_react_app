var dependencies = require('../../../dependencies.js')

var Service = dependencies.Service;
var Models = dependencies.Models;
var ControllerModule = dependencies.ControllerModule;
var UniversalFunctions = dependencies.UniversalFunctions;
var controllerHelper = dependencies.controllerHelper;
var Config = dependencies.Config;
var serviceModule = dependencies.ServiceModule;

Service.makeModule.orgAuthRoles = new serviceModule(require('./OrgAuthRoles'));


function startSection(sectionName) {

console.log('=====================' + sectionName + '===================')
}


function OrgAuthRolesController(service) {

 
//console.log('============================================OrgAuthRolesController controller initialised')
ControllerModule.call(this, service);

this.fakeDelete = true;
		this.uniqueKeys = ["organisationId" , "name"]
}

OrgAuthRolesController.prototype = Object.create(ControllerModule.prototype)


module.exports = {
'orgAuthRoles': new OrgAuthRolesController(Service.makeModule.orgAuthRoles)
};