var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('../../constant');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}
var lastMod = require('../lastModPlugin');

var TalkToExperts = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    // firstName: { type: String, trim: true, index: true },
    // lastName: { type: String, trim: true },
    // businessName: { type: String, trim: true },
    // email: { type: String, trim: true },
    topic: { type: String, trim: true, required: true },
    query: { type: String, trim: true, required: true },
    status: { type: String, default: Config.APP_CONSTANTS.DATABASE_KEYS.queryStatus.pending, enum: Config.APP_CONSTANTS.USER_CONSTANTS.queryStatus.server },
    docs: [{
        name: { type: String, trim: true },
        mimeType: { type: String, trim: true },
        fileType: { type: String, trim: true },
        original: { type: String, trim: true },
        thumbnail: { type: String, trim: true } 
    }],
    isDeleted: { type: Boolean, default: false }
},{
    timestamps : true
});


module.exports = mongoose.model('TalkToExperts', TalkToExperts);