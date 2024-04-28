var Service = require('../../Services');
var Models = require('../../Models');
var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var controllerHelper = require('../../Controllers/commonControllerFunctions');
var Config = require('../../constant');


function startSection(sectionName) {

console.log('=====================' + sectionName + '===================')
}


function AclAndPathsRelationController(service) {

 
//console.log('============================================AclAndPathsRelationController controller initialised')
ControllerModule.call(this, service);
}

AclAndPathsRelationController.prototype = Object.create(ControllerModule.prototype)


module.exports = {
'aclAndPathsRelation': new AclAndPathsRelationController(Service.makeModule.aclAndPathsRelation)
};