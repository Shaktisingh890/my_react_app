var dependencies = require('../../../dependencies.js')

var Service = dependencies.Service;
var Models = dependencies.Models;
var ControllerModule = dependencies.ControllerModule;
var UniversalFunctions = dependencies.UniversalFunctions;
var controllerHelper = dependencies.controllerHelper;
var Config = dependencies.Config;
var serviceModule = dependencies.ServiceModule;

Service.makeModule.apiPaths = new serviceModule(require('./ApiPaths'));

function startSection(sectionName) {

console.log('=====================' + sectionName + '===================')
}


function ApiPathsController(service) {

 
//console.log('============================================ApiPathsController controller initialised')
ControllerModule.call(this, service);
}

ApiPathsController.prototype = Object.create(ControllerModule.prototype)


module.exports = {
'apiPaths': new ApiPathsController(Service.makeModule.apiPaths)
};