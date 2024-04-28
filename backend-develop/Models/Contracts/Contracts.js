var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('../../constant');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}
var lastMod = require('../lastModPlugin');

var Contracts = new Schema({

},{
    timestamps : true
});


module.exports = mongoose.model('Contracts', Contracts);