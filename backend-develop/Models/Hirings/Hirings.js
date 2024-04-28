var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('../../constant');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}
var lastMod = require('../lastModPlugin');

var Hirings = new Schema({
    projectId: {
        type: Schema.ObjectId,
        ref: 'Projects',
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
    proposalId: {
        type: Schema.ObjectId,
        ref: 'Proposals',
        required: true
    },
    docs: [{
        name: { type: String, trim: true },
        mimeType: { type: String, trim: true },
        fileType: { type: String, trim: true },
        original: { type: String, trim: true },
        thumbnail: { type: String, trim: true }
    }],
    isRevoked: { type: Boolean, default: false },
    reasonForRevoking: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false }
},{
    timestamps : true
});


module.exports = mongoose.model('Hirings', Hirings);