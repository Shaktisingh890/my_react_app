var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('../../constant');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}
var lastMod = require('../lastModPlugin');

var AccessTokens = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'Users'
    },
    accessToken: { type: String, index: true, unique: true, required: true },
    deviceToken: { type: String },
    deviceId: { type: String },
    deviceType: {
        type: String,
        enum: Config.APP_CONSTANTS.USER_CONSTANTS.deviceType.server
    },
    userRole: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.userRole.server }
},{
    timestamps : true
});


module.exports = mongoose.model('AccessTokens', AccessTokens);