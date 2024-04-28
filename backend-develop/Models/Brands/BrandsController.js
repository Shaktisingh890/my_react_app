var Service = require('../../Services');
var Models = require('../../Models');
var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var controllerHelper = require('../../Controllers/commonControllerFunctions');
var Config = require('../../constant');


function startSection(sectionName) {

   console.log('=====================' + sectionName + '===================')
}


function BrandsController(service) {

 
   //console.log('============================================BrandsController controller initialised')
   ControllerModule.call(this, service);
}

BrandsController.prototype = Object.create(ControllerModule.prototype)


module.exports = {
   'brands': new BrandsController(Service.makeModule.brands)
};;