

var models = ["testing"]

var pluginName = "Migrations";

var types = {

    string : "string",
    number : "number",
    boolean : "boolean"
}




var modelData = {

// companyZoneRates = {

//     isGetPublic : true ,

//     feilds : [
//     {
//     name : "",
//     type : types.string,
//     unique : true,
//     required : true,
//     editable : true
//     }

//     ]
    
// }


}


var Handlebars = require('handlebars')
var fs = require('fs');
var baseDir = './Models';
var baseDirForPlugin = './Plugins/'+pluginName+'/lib/Models'
//baseDir = baseDirForPlugin;
var dir = "";
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

if (!fs.existsSync(baseDir)){
    fs.mkdirSync(baseDir);
}



models.forEach(function(model){
dir = baseDir+'/'+model.capitalize();
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

createModelFolder(model);
createModel(model);
createController(model);
createRoute(model);
appendModelInIndex(model);
appendServiceInIndex(model);
appendRouteInIndex(model);
appendControllerInIndex(model);

});


function createModelFolder(model){

  //  var filepath = "./Models";

  var  dir = baseDir+'/'+model.capitalize();
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}


}

function appendModelInIndex(model){

var filepath = "./Models/index.js";


    var source = fs.readFileSync( filepath, 'utf8')

    var modelPath = "./"+model.capitalize()+"/"+model.capitalize()+"";

var pathTobeAppend =
"\n, '"+model.capitalize()+"' : require('"+modelPath+"')\n";



    if(source.indexOf(modelPath) == -1)
    {
        //])run\(run\);
        var position = source.match(/\n};/);
console.log(position.index);
     var output = [source.slice(0, position.index), pathTobeAppend, source.slice(position.index)].join('');
 //   // source.splice(, 0, "Lene");
    var fd = fs.openSync(filepath, 'w');
    fs.closeSync(fs.openSync(filepath, 'w'));
    fs.writeFileSync(filepath , output)

    }


}

function appendServiceInIndex(model){

var filepath = "./Services/index.js";


    var source = fs.readFileSync( filepath, 'utf8')

    var modelPath = "./"+model.capitalize()+"/"+model.capitalize()+")";

var pathTobeAppend =
"\n,'"+model+"' : Models."+model.capitalize()+"\n";

// }

// var objectToExport = {

    if(source.indexOf(model+"' : Models."+model.capitalize()) == -1)
    {
        //])run\(run\);
        var position = source.match(/.*}.*\n*.*\n*.*var objectToExport/);
console.log(position.index);
     var output = [source.slice(0, position.index), pathTobeAppend, source.slice(position.index)].join('');
 //   // source.splice(, 0, "Lene");
    var fd = fs.openSync(filepath, 'w');
    fs.closeSync(fs.openSync(filepath, 'w'));
    fs.writeFileSync(filepath , output)

    }


}





function appendControllerInIndex(model){

var filepath = "./Controllers/index.js";


    var source = fs.readFileSync( filepath, 'utf8')

    var controllerPath = "./../Models/"+model.capitalize()+"/"+model.capitalize()+"Controller"

var pathTobeAppend =
"\nobjectToExport.makeModule['"+model+"'] = require('../Models/"+model.capitalize()+"/"+model.capitalize()+"Controller')."+model+";\n\n\n";



    if(source.indexOf("objectToExport.makeModule['"+model+"']") == -1)
    {
        //])run\(run\);
        var position = source.match(/module\.exports = objectToExport;/);
console.log(position.index);
     var output = [source.slice(0, position.index), pathTobeAppend, source.slice(position.index)].join('');
 //   // source.splice(, 0, "Lene");
    var fd = fs.openSync(filepath, 'w');
    fs.closeSync(fs.openSync(filepath, 'w'));
    fs.writeFileSync(filepath , output)

    }


}


function appendRouteInIndex(model){

var filepath = "./Routes/index.js";


    var source = fs.readFileSync( filepath, 'utf8')

    var routePath = "./../Models/"+model.capitalize()+"/"+model.capitalize()+"Routes"

var pathTobeAppend =
"\n       else if (key == '"+model+"') {"+"\n"+
       " makeModule[key] = require('"+routePath+"')."+model+";"+"\n"+
    "}\n\n\n";



    if(source.indexOf(routePath) == -1)
    {
        //])run\(run\);
        var position = source.match(/all.*=.*all\.concat\(makeModule\[key\]\.getRoutes\(\)\)\;/);
console.log(position.index);
     var output = [source.slice(0, position.index), pathTobeAppend, source.slice(position.index)].join('');
 //   // source.splice(, 0, "Lene");
    var fd = fs.openSync(filepath, 'w');
    fs.closeSync(fs.openSync(filepath, 'w'));
    fs.writeFileSync(filepath , output)

    }


}

function createService(model){
	var filepath = dir+'/'+model.capitalize()+'Service.js';
	if (!fs.existsSync(filepath)){
	var fd = fs.openSync(filepath, 'w');
	fs.closeSync(fs.openSync(filepath, 'w'));
	
}

}

function createService(model){
    var filepath = dir+'/'+model.capitalize()+'Service.js';
    if (!fs.existsSync(filepath)){
    var fd = fs.openSync(filepath, 'w');
    fs.closeSync(fs.openSync(filepath, 'w'));
    
}

}



function createController(model){

	var filepath = dir+'/'+model.capitalize()+'Controller.js';
if (!fs.existsSync(filepath)){
	var fd = fs.openSync(filepath, 'w');

	fs.closeSync(fs.openSync(filepath, 'w'));
	fs.writeFileSync(filepath , getControllerOverridingData(model))
}

}

function createRoute(model){

	var filepath = dir+'/'+model.capitalize()+'Routes.js';
if (!fs.existsSync(filepath)){
	var fd = fs.openSync(filepath, 'w');

	fs.closeSync(fs.openSync(filepath, 'w'));
	fs.writeFileSync(filepath , getRouteOverridingData(model))
}

}


function createModel(model){

    var filepath = dir+'/'+model.capitalize()+'.js';
if (!fs.existsSync(filepath)){
    var fd = fs.openSync(filepath, 'w');

    fs.closeSync(fs.openSync(filepath, 'w'));
    fs.writeFileSync(filepath , getModelOverridingData(model))
}

}


function getModelOverridingData(model){
var source = 
"var mongoose = require('mongoose');"+"\n"+
"var Schema = mongoose.Schema;"+"\n"+
""+"\n"+
"var Config = require('../../constant');"+"\n"+
"// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}"+"\n"+
"var lastMod = require('../lastModPlugin');"+"\n"+
""+"\n"+
"var {{MODEL_NAME_CAP}} = new Schema({"+"\n"+
""+"\n"+
"},{"+"\n"+
    "timestamps : true"+"\n"+
"});"+"\n"+
""+"\n"+
""+"\n"+
"module.exports = mongoose.model('{{MODEL_NAME_CAP}}', {{MODEL_NAME_CAP}});"+"\n"

var data = {
    MODEL_NAME_CAP : model.capitalize(),
    MODEL_NAME : model
}
var finalResult = Handlebars.compile(source)(data);

return finalResult;
}

function getControllerOverridingData(model){


var source = 
"var Service = require('../../Services');"+"\n"+
"var Models = require('../../Models');"+"\n"+
"var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;"+"\n"+
"var UniversalFunctions = require('../../Utils/UniversalFunctions');"+"\n"+
"var controllerHelper = require('../../Controllers/commonControllerFunctions');"+"\n"+
"var Config = require('../../constant');"+"\n"+
""+"\n"+
""+"\n"+
"function startSection(sectionName) {"+"\n"+
""+"\n"+
    "console.log('=====================' + sectionName + '===================')"+"\n"+
"}"+"\n"+
""+"\n"+
""+"\n"+
"function {{CONTROLLER_NAME}}(service) {"+"\n"+
""+"\n"+
" "+"\n"+
    "//console.log('============================================{{CONTROLLER_NAME}} controller initialised')"+"\n"+
    "ControllerModule.call(this, service);"+"\n"+
"}"+"\n"+
""+"\n"+
"{{CONTROLLER_NAME}}.prototype = Object.create(ControllerModule.prototype)"+"\n"+
""+"\n"+
""+"\n"+
"module.exports = {"+"\n"+
    "'{{MODEL_NAME}}': new {{CONTROLLER_NAME}}(Service.makeModule.{{MODEL_NAME}})"+"\n"+
"};";


var data = {
	CONTROLLER_NAME : model.capitalize()+"Controller",
	MODEL_NAME : model
}
var finalResult = Handlebars.compile(source)(data);

return finalResult;

}

function getRouteOverridingData(model) {



var source = 
"var routesModule = require('../../Routes/RoutesModule').Routes;"+"\n"+
"var Controller = require('../../Controllers');"+"\n"+
"var UniversalFunctions = require('../../Utils/UniversalFunctions');"+"\n"+
"var commonRoutes = require('../../Routes/commonRoutesThings');"+"\n"+
"var Joi = require('joi');"+"\n"+
""+"\n"+
"var payload = {"+"\n"+
    "maxBytes: 20000000,"+"\n"+
    "parse: true,"+"\n"+
    "output: 'file',"+"\n"+
"}"+"\n"+
""+"\n"+
"var schema = {"+"\n"+
    "put: {"+"\n"+
        ""+"\n"+
    "},"+"\n"+
    "post: {"+"\n"+
       ""+"\n"+
    "}"+"\n"+
"}"+"\n"+
""+"\n"+
""+"\n"+
"function {{ROUTE_NAME}}(controller, requestSchema, mainKey, subKey , payload) {"+"\n"+
""+"\n"+
""+"\n"+
""+"\n"+
    "// binding this controller with the controller in the p arent module i.e. routesModule"+"\n"+
    "routesModule.call(this, controller, requestSchema, mainKey, subKey , payload);"+"\n"+
"}"+"\n"+
""+"\n"+
"{{ROUTE_NAME}}.prototype = Object.create(routesModule.prototype) // inheritance happening"+"\n"+
""+"\n"+
""+"\n"+
"{{ROUTE_NAME}}.prototype.getParentRoutes = {{ROUTE_NAME}}.prototype.getRoutes;"+"\n"+
"//{{ROUTE_NAME}}.prototype.overridedParantFunction = {{ROUTE_NAME}}.prototype.ParantFunction;"+"\n"+
""+"\n"+
""+"\n"+
"{{ROUTE_NAME}}.prototype.newFunction = function(request, reply){"+"\n"+
""+"\n"+
""+"\n"+
     "this.controller.anyController(request.params.id, commonRoutes.handleControllerResponseWithoutAuth.bind({"+"\n"+
        "reply: reply,"+"\n"+
        "request: request"+"\n"+
    "}));"+"\n"+
""+"\n"+
"}"+"\n"+
""+"\n"+
"{{ROUTE_NAME}}.prototype.getRoutes = function(request, reply) {"+"\n"+
""+"\n"+
    "var seperator = '';"+"\n"+
    "if (this.apiName) {"+"\n"+
        "seperator = '/'"+"\n"+
    "}"+"\n"+
""+"\n"+
    "var newRoutes =[ "+"\n"+
""+"\n"+
    "// You can write new routes here"+"\n"+
    "// "+"\n"+
    ""+"\n"+
    "// {"+"\n"+
    "//     method: 'GET',"+"\n"+
    "//     path: '/api/' + this.apiName ,"+"\n"+
    "//     handler: this.newFunction.bind(this),"+"\n"+
    "//     config: {"+"\n"+
    "//         validate: {"+"\n"+
    "//             query: {"+"\n"+
    "//             }"+"\n"+
""+"\n"+
    "//         },"+"\n"+
    "//         description: 'get a module by its id',"+"\n"+
    "//         tags: ['api', this.moduleName],"+"\n"+
    "//         plugins: commonRoutes.routesPlugin"+"\n"+
    "//     }"+"\n"+
    "// }"+"\n"+
""+"\n"+
""+"\n"+
""+"\n"+
    "]"+"\n"+
""+"\n"+
""+"\n"+
    "return this.getParentRoutes().concat(newRoutes);"+"\n"+
"}"+"\n"+
""+"\n"+
"module.exports = {"+"\n"+
    "'{{MODEL_NAME}}': new {{ROUTE_NAME}}(Controller.makeModule.{{MODEL_NAME}}, schema, 'admins', '{{MODEL_NAME}}')"+"\n"+
"};"

var data = {
	ROUTE_NAME : model.capitalize()+"Route",
	MODEL_NAME : model
}
var finalResult = Handlebars.compile(source)(data);

return finalResult;

}