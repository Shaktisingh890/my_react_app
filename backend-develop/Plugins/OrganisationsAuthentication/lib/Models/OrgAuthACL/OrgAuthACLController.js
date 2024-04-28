var dependencies = require('../../../dependencies.js')

var Service = dependencies.Service;
var Models = dependencies.Models;
var ControllerModule = dependencies.ControllerModule;
var UniversalFunctions = dependencies.UniversalFunctions;
var controllerHelper = dependencies.controllerHelper;
var Config = dependencies.Config;
var serviceModule = dependencies.ServiceModule;

Service.makeModule.orgAuthACL = new serviceModule(require('./OrgAuthACL'));


function startSection(sectionName) {

console.log('=====================' + sectionName + '===================')
}


function OrgAuthACLController(service) {

 
//console.log('============================================OrgAuthACLController controller initialised')
ControllerModule.call(this, service);
}

OrgAuthACLController.prototype = Object.create(ControllerModule.prototype)


module.exports = {
'orgAuthACL': new OrgAuthACLController(Service.makeModule.orgAuthACL)
};