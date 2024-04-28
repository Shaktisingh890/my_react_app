var dependencies = require('../../../dependencies.js')

var Service = dependencies.Service;
var Models = dependencies.Models;
var ControllerModule = dependencies.ControllerModule;
var UniversalFunctions = dependencies.UniversalFunctions;
var controllerHelper = dependencies.controllerHelper;
var Config = dependencies.Config;
var serviceModule = dependencies.ServiceModule;

Service.makeModule.permissions = new serviceModule(require('./permissions'));


function startSection(sectionName) {

console.log('=====================' + sectionName + '===================')
}


function PermissionsController(service) {

 
//console.log('============================================PermissionsController controller initialised')
ControllerModule.call(this, service);
}

PermissionsController.prototype = Object.create(ControllerModule.prototype)


module.exports = {
'permissions': new PermissionsController(Service.makeModule.permissions)
};