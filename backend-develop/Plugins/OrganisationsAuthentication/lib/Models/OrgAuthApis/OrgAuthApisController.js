var dependencies = require('../../../dependencies.js')

var Service = dependencies.Service;
var Models = dependencies.Models;
var ControllerModule = dependencies.ControllerModule;
var UniversalFunctions = dependencies.UniversalFunctions;
var controllerHelper = dependencies.controllerHelper;
var Config = dependencies.Config;
var serviceModule = dependencies.ServiceModule;

Service.makeModule.orgAuthApis = new serviceModule(require('./OrgAuthApis'));


function startSection(sectionName) {

console.log('=====================' + sectionName + '===================')
}


function OrgAuthApisController(service) {

 
//console.log('============================================OrgAuthApisController controller initialised')
ControllerModule.call(this, service);
}

OrgAuthApisController.prototype = Object.create(ControllerModule.prototype)


module.exports = {
'orgAuthApis': new OrgAuthApisController(Service.makeModule.orgAuthApis)
};