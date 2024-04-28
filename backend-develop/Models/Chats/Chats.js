var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('../../constant');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}
var lastMod = require('../lastModPlugin');

var Chats = new Schema({
    projectId: {
        type: Schema.ObjectId,
        ref: 'Projects',
        required: true
    },
    title: { type: String, trim: true, index: true, sparse: true },
    initiatedBy: {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    otherUser: {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    brandId: {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    serviceProviderId: {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    participants: [{
        type: Schema.ObjectId,
        ref: 'Users',
        required: true
    }],
    initSource: { type: String, trim: true, enum: Config.APP_CONSTANTS.USER_CONSTANTS.chatInitSources.server },
    twilioConversationSid: { type: String, trim: true, required: true, index: true },
    twilioChatSid: { type: String, trim: true, required: true, index: true },
    twilioChatObj: { type: String },
    status: { type: String, trim: true, enum: Config.APP_CONSTANTS.USER_CONSTANTS.chatStatus.server, default: Config.APP_CONSTANTS.DATABASE_KEYS.chatStatus.active },
    lastMessage: { type: String, trim: true },
    lastMessageBy: {
        type: Schema.ObjectId,
        ref: 'Users'
    },
    blockedBy: {
        type: Schema.ObjectId,
        ref: 'Users'
    },
    blockedAt: { type: Date },
    archivedFor: [{
        type: Schema.ObjectId,
        ref: 'Users'
    }],
    deletedFor: [{
        type: Schema.ObjectId,
        ref: 'Users'
    }],
    lastMessageEmailTime: { type: Object }
},{
    timestamps : true
});


module.exports = mongoose.model('Chats', Chats);