var Service = require('../../Services');
var Models = require('../../Models');
var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var controllerHelper = require('../../Controllers/commonControllerFunctions');
var Config = require('../../constant');


function startSection(sectionName) {

   console.log('=====================' + sectionName + '===================')
}


function ServiceProvidersController(service) {

 
   //console.log('============================================ServiceProvidersController controller initialised')
   ControllerModule.call(this, service);
}

ServiceProvidersController.prototype = Object.create(ControllerModule.prototype)


module.exports = {
   'serviceProviders': new ServiceProvidersController(Service.makeModule.serviceProviders)
};;