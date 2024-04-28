var dependencies = require('../../../dependencies.js')

var Service = dependencies.Service;
var Models = dependencies.Models;
var ControllerModule = dependencies.ControllerModule;
var UniversalFunctions = dependencies.UniversalFunctions;
var controllerHelper = dependencies.controllerHelper;
var Config = dependencies.Config;
var serviceModule = dependencies.ServiceModule;

Service.makeModule.orgAuthPermissions = new serviceModule(require('./OrgAuthPermissions'));


function startSection(sectionName) {

console.log('=====================' + sectionName + '===================')
}


function OrgAuthPermissionsController(service) {

 
//console.log('============================================OrgAuthPermissionsController controller initialised')
ControllerModule.call(this, service);
}

OrgAuthPermissionsController.prototype = Object.create(ControllerModule.prototype)


module.exports = {
'orgAuthPermissions': new OrgAuthPermissionsController(Service.makeModule.orgAuthPermissions)
};