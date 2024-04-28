var Service = require('../../Services');
var Models = require('../../Models');
var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var controllerHelper = require('../../Controllers/commonControllerFunctions');
var Config = require('../../constant');


function startSection(sectionName) {

   console.log('=====================' + sectionName + '===================')
}


function MessagesController(service) {

 
   //console.log('============================================MessagesController controller initialised')
   ControllerModule.call(this, service);
}

MessagesController.prototype = Object.create(ControllerModule.prototype)


module.exports = {
   'messages': new MessagesController(Service.makeModule.messages)
};;