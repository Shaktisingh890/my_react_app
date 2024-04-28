
var fs = require('fs');



var models = ["notifications"]


var Types = {
    string : "string",
    number : "number",
    boolean : "boolean"
}




var modelData = {

// companyZoneRates = {

//     isGetPublic : true ,

//     fields : [
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
var baseDirForPlugin = './Plugins/Chat/lib/Models'
//baseDir = baseDirForPlugin;
var dir = "";
var testCaseDir = "./specs/modelsTesting"
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
createTestCase(model);
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

function createTestCase(model){

    var filepath = testCaseDir+'/'+model.capitalize()+'ModuleTest.js';
if (!fs.existsSync(filepath)){
    var fd = fs.openSync(filepath, 'w');

    fs.closeSync(fs.openSync(filepath, 'w'));
    fs.writeFileSync(filepath , getTestcaseOverridingData(model))
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

 var source = fs.readFileSync('./OverridingModule/templates/modelTemplate', 'utf8');


var data = {
    MODEL_NAME_CAP : model.capitalize(),
    MODEL_NAME : model
}
var finalResult = Handlebars.compile(source)(data);

return finalResult;
}

function getControllerOverridingData(model){


     var source = fs.readFileSync('./OverridingModule/templates/ControllerTemplate', 'utf8');


var data = {
	CONTROLLER_NAME : model.capitalize()+"Controller",
	MODEL_NAME : model
}
var finalResult = Handlebars.compile(source)(data);

return finalResult;

}

function getTestcaseOverridingData(model){


     var source = fs.readFileSync('./OverridingModule/templates/testCaseTemplate', 'utf8');


var data = {
    MODEL_NAME_CAP : model.capitalize(),
    MODEL_NAME : model
}
var finalResult = Handlebars.compile(source)(data);

return finalResult;

}

function getRouteOverridingData(model) {

 var source = fs.readFileSync('./OverridingModule/templates/routeTemplate', 'utf8');


var data = {
	ROUTE_NAME : model.capitalize()+"Route",
	MODEL_NAME : model
}
var finalResult = Handlebars.compile(source)(data);

return finalResult;

}
