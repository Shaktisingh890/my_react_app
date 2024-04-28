var fs = require('fs'),
    path = require('path');

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}
var basePath = './lib/Models';
var modules = [];
getDirectories(basePath).forEach(function(folderName){
	modules.push({
		[folderName] :  require(basePath+"/"+folderName+"/"+folderName)
	})
})

module.exports = modules