var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Constants = require('../../constants.js');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}


var OrgAuthACL = new Schema({

	
	roleId: {
		type: Schema.ObjectId,
        ref: 'Roles',
        required: true
	},
	uiElementId : {type: String, trim: true },
	model : {type: String, trim: true },
	isAllow : {type : Boolean , default : true},
	permission : {type: String, trim: true, required: true, enum:[
			Constants.PERMISSIONS.READ,
			Constants.PERMISSIONS.ADD,
			Constants.PERMISSIONS.EDIT,
			Constants.PERMISSIONS.DELETE,
			Constants.PERMISSIONS.NONE
		], default: Constants.PERMISSIONS.NONE}

},{
timestamps : true
});


module.exports = mongoose.model('OrgAuthACL', OrgAuthACL);
