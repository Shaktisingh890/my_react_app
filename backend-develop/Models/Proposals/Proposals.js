var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('../../constant');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}
var lastMod = require('../lastModPlugin');

var Proposals = new Schema({
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
    coverLetter: { type: String, trim: true, required: true },
    costType: {
        type: String,
        trim: true,
        index: true,
        enum: Config.APP_CONSTANTS.USER_CONSTANTS.proposalCostTypes.server,
        default: Config.APP_CONSTANTS.DATABASE_KEYS.proposalCostTypes.fixed
    },
    cost: { type: Number },
    timeline: { type: Number }, //in months,
    status: {
        type: String,
        trim: true,
        index: true,
        enum: Config.APP_CONSTANTS.USER_CONSTANTS.proposalStatus.server,
        default: Config.APP_CONSTANTS.DATABASE_KEYS.proposalStatus.sent
    },
    docs: [{
        name: { type: String, trim: true },
        mimeType: { type: String, trim: true },
        fileType: { type: String, trim: true },
        original: { type: String, trim: true },
        thumbnail: { type: String, trim: true }
    }],
    isArchived: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    editHistory: [{
        editAt: { type: Date },
        editBy: {
            type: Schema.ObjectId,
            ref: 'Users'
        },
        payload: { type: Object },
        oldData: { type: Object },
        editByAdmin: { type: Boolean }
    }],
    isHiringDone: { type: Boolean },
    hiringDate: { type: Date }

},{
    timestamps : true
});


module.exports = mongoose.model('Proposals', Proposals);