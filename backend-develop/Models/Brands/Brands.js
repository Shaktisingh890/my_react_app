var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('../../constant');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}
var lastMod = require('../lastModPlugin');

var Brands = new Schema({

    ownerId: {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    name: { type: String, trim: true, required: true, index: true },
    description: { type: String, trim: true, default: "" },
    companyType: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.companyTypes.server, index: true, required: true },
    distributorType: [{ type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.distributorType.server, index: true, sparse: true }],
    mainSpecialities: [{ type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.mainSpecialities.server, index: true, sparse: true }],
    otherMainSpecialities: [{ type: String, trim: true }], // in case SP selects Other in main specialities
    additionalCapacities: [{ type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.mainSpecialities.server, index: true, sparse: true }],
    otherAdditionalCapacities: [{ type: String, trim: true }], // in case SP selects Other in additional capacities
    industryExperience: [{ type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.industryExperience.server }],
    businessSize: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.businessSize.server, index: true, sparce: true },
    originCountry: { type: String, trim: true },
    languagesSpoken: [{ type: String, trim: true }],
    website: { type: String, trim: true },
    foundingYear: { type: String, trim: true },
    hqLocation: {
        line1: { type: String, trim: true },
        line2: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        pin: { type: String, trim: true },
        location: { type: [Number], index: '2dsphere', default: [0, 0] },
    },
    companyRegistrationType: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.companyRegistrationTypes.server, index: true, sparse: true },
    segmentExperience: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.segmentExperience.server, index: true, sparse: true },
    logo: {
        original: { type: String, trim: true, default: null },
        thumbnail: { type: String, trim: true, default: null }
    },
    docs: [{
        fileType: { type: String, trim: true },
        url: { type: String, trim: true }
    }],
    isDeleted: { type: Boolean, default: false }
    
},{
    timestamps : true
});


module.exports = mongoose.model('Brands', Brands);