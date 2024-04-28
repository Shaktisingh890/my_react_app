var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Constants = require('../../constants.js');

var ApiPaths = new Schema({
	method : {type : String },
	path : {type : String},
	isPublic : {type : Boolean},
	allow : [{
		type: Schema.ObjectId,
        ref: 'Roles'
	}],
	denyIds : []

},{
timestamps : true
});


module.exports = mongoose.model('ApiPaths', ApiPaths);
