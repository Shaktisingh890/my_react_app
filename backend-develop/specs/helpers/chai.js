const chai = require('chai');
const request = require('supertest');
const _ = require('underscore');


chai.config.includeStack = true;

const userData = {
    email : "info@charpixel.com",
    password : "123456",
    accessToken : ""
}

const adminData = {
    email : "admin@expanter.com",
    password : "char123##",
    accessToken : ""
}

const vendorData = {

}

function log(){

    console.log.apply(null , arguments);
}

const testServer = "http://api-dev.expanter.com:7077";
const testLocal = 'http://localhost:7077';

const server = testLocal

function json(verb, url) {
    console.log("------------hitting on url:  " + server+ url)
    return request(server)[verb](url)

    .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
}

global._ = _;

if (server == testLocal) {

    global.account = {
        email: "1455611903876@gmail.com",
        password: "123456"
    }
    } else {
    global.account = {
        email: "ashu@gmail.com",
        password: "ASHUashu11"
    }

}


global.userData = userData
global.adminData = adminData;

fs = require('fs');

function saveTofile(fileName, dataToSave) {

    fs.writeFileSync(__dirname + "\\" + fileName + '.json', JSON.stringify(dataToSave), 'utf-8');

    console.log("done in dir : = > " + __dirname)
    console.log(__filename);
    // fs.writeFile( __dirname+"\\"+ fileName+'.json',JSON.stringify( data), function (err) {
    //   if (err) return console.log(err);



    // });
}


function random(max) {
    return Math.floor((Math.random(new Date()) * max) );
}

var fs = require('fs');

const testImages = fs.readdirSync('./testImages');
const testVideos = fs.readdirSync('./testVideos');

console.log(testVideos)
console.log(random(testVideos.length))

// function readFiles(dirname) {
//   fs.readdirSync(dirname)
// }

// readFiles('./testImages');


function getRandomImage() {
    return './testImages/'+testImages[random(testImages.length - 1)]
}


function getRandomVideos() {
  return './testVideos/'+testVideos[random(testVideos.length - 1)]
}


function readJSONFromFile(filename) {
    const obj = JSON.parse(fs.readFileSync(filename + '.json', 'utf8'));
    return obj;
}

global.readJSONFromFile = readJSONFromFile;

global.saveTofile = saveTofile;

global.getRandomImage = getRandomImage;
global.getRandomVideos = getRandomVideos;
global.random = random;

global.CURRENT_ACCESS_TOKEN = null;
global.USER_ACCESS_TOKEN = null;
global.ADMIN_ACCESS_TOKEN = null;
global.getBearer = function(token){

    if(token == null){
        return getBearer(CURRENT_ACCESS_TOKEN)
    }

    return "bearer "+token;

}
    ;

global.getAdminBearer = function (token) {

    if (token == null) {
        return getAdminBearer(ADMIN_ACCESS_TOKEN)
    }

    return "bearer " + token;

}
    ;


global.json = json;
global.log = log;
global.request = request;
// global.common = require('../commonTestingData');
global.getData = {

}
global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

global.vendorData = vendorData;
