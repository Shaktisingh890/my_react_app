var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Constants = require('../../constants.js');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}


var Permissions = new Schema({

},{
timestamps : true
});


module.exports = mongoose.model('Permissions', Permissions);
