const constant = require('../constant');


function getFileFormat(filePath) {
    return getLastElement(filePath.split("."))
}


function getLastElement(arr) {
    return arr[arr.length - 1]
}

function FileToJsonConverter(filePath) {

    this.errorMsg = constant.APP_CONSTANTS.STATUS_MSG.ERROR;
}

FileToJsonConverter.prototype.init = function(file) {

    console.log(file)

    var filePath = file.path;
    var fileName = file.filename;


    if (typeof file != 'object' || typeof filePath != 'string') {

        this.error = this.errorMsg.INVALID_FILE_OBJECT
        return
    }


    console.log(fileName, filePath);
    this.filePath = filePath;
    this.fileFormat = getFileFormat(fileName);
    this.supportedFileFormats = ['csv', 'xlsx'];
    this.isFileFormatSupported = this.supportedFileFormats.indexOf(this.fileFormat.toLowerCase()) > -1 ? true : false;
    this.convertFunction = this.convertFromXl;

    console.log(this.fileFormat);

    if (this.fileFormat.toLowerCase() == 'csv') {
        this.convertFunction = this.convertFromCSV;
    } else
    if (this.fileFormat.toLowerCase() == 'xlsx') {
        this.convertFunction = this.convertFromCSV;
    } else {
        this.error = this.errorMsg.INVALID_FILE_FORMAT
    }

}

FileToJsonConverter.prototype.getJson = function(file, callback) {

    console.log(file)

    if (typeof file == 'function') {
        callback = file;
    } else {

        if (file) {
            this.init(file);
        }
    }


    if (this.error) {
        return callback(this.error)
    }

    var jsonData = this.convertFunction();
    if (Array.isArray(jsonData)) {
        jsonData = jsonData.slice(1, jsonData.length)
    }

    if (Array.isArray(jsonData)) {
        jsonData = jsonData.slice(1, jsonData.length)
    }


    if (typeof callback == 'function') {
        process.nextTick(callback.bind(null, null, jsonData));
    } else {

        return jsonData;
    }


}

FileToJsonConverter.prototype.convertFromCSV = function() {

    var csvjson = require('csvjson');

    return csvjson.toObject(this.filePath).output;
}


FileToJsonConverter.prototype.convertFromXl = function() {

    if (typeof require !== 'undefined') XLSX = require('xlsx');

    var workbook = XLSX.readFile(this.filePath);

    console.log(workbook)

    var sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(function(y) {
        var worksheet = workbook.Sheets[y];
        var headers = {};
        var data = [];
        for (z in worksheet) {
            if (z[0] === '!') continue;
            //parse out the column, row, and value
            var col = z.substring(0, 1);
            var row = parseInt(z.substring(1));
            var value = worksheet[z].v;

            //store header names
            if (row == 1) {
                headers[col] = value;
                continue;
            }

            if (!data[row]) data[row] = {};
            data[row][headers[col]] = value;
        }
        //drop those first two rows which are empty
        data.shift();
        data.shift();
        return data;
    });


}
var con = new FileToJsonConverter();


module.exports = con;
