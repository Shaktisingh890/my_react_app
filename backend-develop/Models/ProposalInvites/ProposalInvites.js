var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('../../constant');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}
var lastMod = require('../lastModPlugin');

var ProposalInvites = new Schema({
    brandId: {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    projectId: {
        type: Schema.ObjectId,
        ref: 'Projects',
        required: true
    },
    serviceProviderId: {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    chatId: {
        type: Schema.ObjectId,
        ref: 'Chats'
    },
    isDeleted: { type: Boolean, default: false }
},{
    timestamps : true
});


module.exports = mongoose.model('ProposalInvites', ProposalInvites);