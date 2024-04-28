var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('../../constant');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}
var lastMod = require('../lastModPlugin');

var Projects = new Schema({

    brandId: {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    briefType: { type: String, trim: true, index: true, required: true, enum: Config.APP_CONSTANTS.USER_CONSTANTS.projectBriefingTypes.server },
    brandOverview: { type: String, trim: true, required: true },
    hideBrandDetails: { type: Boolean, default: false },
    wayOfOperation: [{ type: String, trim: true, index: true, sparse: true, enum: Config.APP_CONSTANTS.USER_CONSTANTS.wayOfOperations.server }],
    projectOverview: { type: String, trim: true },
    objective: [{ type: String, trim: true, index: true, sparse: true }],
    name: { type: String, trim: true, required: true, index: true },
    requirements: {
        industryExperience: [{ type: String, index: true, sparse: true }],
        segmentExperience: [{ type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.segmentExperience.server, index: true, sparse: true }],
        languageSpoken: [{ type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.languageSpoken.server, index: true, sparse: true }],
        teamSize: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.teamSizeRequirements.server, index: true, sparse: true },
        experience: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.requiredExperience.server, index: true, sparse: true },
        chinaOfficeLocation: [{ type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.chinaCities.server, index: true, sparse: true }],
    },
    budgetTypes: [{ type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.budgetTypes.server, index: true, sparse: true }],
    budget: {
        retainerBased: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.projectStartingFee_USD.server, index: true, sparse: true },
        projectBased: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.projectStartingFee_USD.server, index: true, sparse: true }
    },
    startingTimeline: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.startingTimeline.server, index: true, sparse: true },
    proposalsReceived: { type: Number, default: 0 },
    docs: [{
        name: { type: String, trim: true },
        mimeType: { type: String, trim: true },
        fileType: { type: String, trim: true },
        original: { type: String, trim: true },
        thumbnail: { type: String, trim: true }
    }],
    notes: { type: String, default: "" },
    isPublic: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    status: {
        type: String,
        trim: true,
        index: true,
        enum: Config.APP_CONSTANTS.USER_CONSTANTS.projectStatus.server,
        default: Config.APP_CONSTANTS.DATABASE_KEYS.projectStatus.active
    },
    isHiringDone: { type: Boolean },
    hiringDate: { type: Date },
    isDeleted: { type: Boolean, default: false }

},{
    timestamps : true
});


module.exports = mongoose.model('Projects', Projects);