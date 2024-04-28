var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Constants = require('../../constants.js');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}


var OrgAuthRoles = new Schema({


	organisationId : {
		type: Schema.ObjectId,
        ref: 'Organisations',
        required: true
	},
	name : {type : String , unique : true},
	permissions : [{
		type: Schema.ObjectId,
        ref: 'OrgAuthPermissions',
        
	}]

},{
timestamps : true
});
OrgAuthRoles.index({name: 1, organisationId: 1 }, {unique: true});

module.exports = mongoose.model('OrgAuthRoles', OrgAuthRoles);
