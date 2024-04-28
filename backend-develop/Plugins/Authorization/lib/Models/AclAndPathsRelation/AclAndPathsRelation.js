var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Constants = require('../../constants.js');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}


var AclAndPathsRelation = new Schema({

	aclId : {
		type: Schema.ObjectId,
        ref: 'AccessControlList',
        required: true
	},
	apiPathId : {
		type: Schema.ObjectId,
        ref: 'ApiPaths',
        required: true

	},
	isAllow : {
		type : Boolean,
		default : false
	}
},{

timestamps : true

});


module.exports = mongoose.model('AclAndPathsRelation', AclAndPathsRelation);
