var Service = require('../../Services');
var Models = require('../../Models');
var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var controllerHelper = require('../../Controllers/commonControllerFunctions');
var Config = require('../../constant');


function startSection(sectionName) {

   console.log('=====================' + sectionName + '===================')
}


function ContractsController(service) {

 
   //console.log('============================================ContractsController controller initialised')
   ControllerModule.call(this, service);
}

ContractsController.prototype = Object.create(ControllerModule.prototype)


module.exports = {
   'contracts': new ContractsController(Service.makeModule.contracts)
};;