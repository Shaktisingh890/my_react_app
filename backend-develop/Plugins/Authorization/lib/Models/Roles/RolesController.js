var dependencies = require('../../../dependencies.js')

var Service = dependencies.Service;
var Models = dependencies.Models;
var ControllerModule = dependencies.ControllerModule;
var UniversalFunctions = dependencies.UniversalFunctions;
var controllerHelper = dependencies.controllerHelper;
var Config = dependencies.Config;
var serviceModule = dependencies.ServiceModule;

Service.makeModule.roles = new serviceModule(require('./Roles'));

function startSection(sectionName) {

console.log('=====================' + sectionName + '===================')
}


function RolesController(service) {

 
//console.log('============================================RolesController controller initialised')
ControllerModule.call(this, service);
}

RolesController.prototype = Object.create(ControllerModule.prototype)


module.exports = {
'roles': new RolesController(Service.makeModule.roles)
};