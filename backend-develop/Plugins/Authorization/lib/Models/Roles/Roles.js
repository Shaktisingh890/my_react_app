var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Roles = new Schema({
	name : {type : String , unique : true},
	permissions : [{
		type: Schema.ObjectId,
        ref: 'Permissions',
        required: true
	}]

},{
timestamps : true
});


module.exports = mongoose.model('Roles', Roles);
