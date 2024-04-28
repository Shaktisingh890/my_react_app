var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Constants = require('../../constants.js');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}


var OrgAuthApis = new Schema({

	method : {type : String },
	path : {type : String},
	name : {type : String},

	isPublic : {type : Boolean},
	allow : [{
		type: Schema.ObjectId,
        ref: 'OrgAuthRoles'
	}],
	denyIds : [{
		type: Schema.ObjectId,
        ref: 'OrgAuthRoles'
	}]

},{
timestamps : true
});


module.exports = mongoose.model('OrgAuthApis', OrgAuthApis);
