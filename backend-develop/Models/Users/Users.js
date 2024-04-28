const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Config = require('../../constant');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}
const lastMod = require('../lastModPlugin');

const Users = new Schema({

    firstName: { type: String, trim: true, index: true, required: true },
    lastName: { type: String, trim: true, index: true, default: "" },
    email: { type: String, trim: true, index: true, unique: true, required: true },
    password: { type: String },
    userRole: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.userRole.server, required: true },
    serviceProviderType: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.serviceProviderTypes.server, index: true, sparse: true },
    resetPasswordToken: { type: String, trim: true, index: true, unique: true, sparse: true },
    emailVerificationToken: { type: String, trim: true, index: true, unique: true, sparse: true },
    businessName: { type: String, trim: true, index: true, sparse: true },
    description: { type: String, trim: true, default: "" },
    companyType: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.companyTypes.server, index: true, sparse: true },
    businessModel: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.businessModel.server, index: true, sparse: true },
    distributorType: [{ type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.distributorType.server, index: true, sparse: true }],
    mainSpecialities: [{ type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.mainSpecialities.server, index: true, sparse: true }], //type of service provider
    otherMainSpecialities: [{ type: String, trim: true }], // in case SP selects Other in main specialities
    additionalCapacities: [{ type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.mainSpecialities.server, index: true, sparse: true }],
    otherAdditionalCapacities: [{ type: String, trim: true }], // in case SP selects Other in additional capacities
    industryExperience: [{ type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.industryExperience.server }],
    businessSize: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.businessSize.server, index: true, sparce: true },
    originCountry: { type: String, trim: true },
    internationalPresence: [{ type: String, trim: true }],
    languagesSpoken: [{ type: String, trim: true }],
    website: { type: String, trim: true },
    otherDetails: { type: String, trim: true },
    linkedinUrl: { type: String, trim: true },
    foundingYear: { type: String, trim: true },
    foundingHistory: { type: String, trim: true },
    globalNoPOS: { type: Number },
    hqLocation: { type: String, trim: true },
    presenceInChina: { type: Boolean, default: false }, // Brand Profile
    experienceInChina: { type: String, trim: true, enum: Config.APP_CONSTANTS.USER_CONSTANTS.experienceInChina.server },  // Brand Profile
    locationsInChina: [{ type: String, trim: true }], //Service Provider Profile
    companyRegistrationType: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.companyRegistrationTypes.server, index: true, sparse: true },
    segmentExperience: [{ type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.segmentExperience.server, index: true, sparse: true }],
    annualTurnover: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.annualTurnover.server, index: true, sparse: true },
    staffSize: { type: String, trim: true },
    logo: {
        name: { type: String, trim: true },
        mimeType: { type: String, trim: true },
        fileType: { type: String, trim: true },
        original: { type: String, trim: true, default: null },
        thumbnail: { type: String, trim: true, default: null } //file type image
    },
    docs: [{
        name: { type: String, trim: true },
        mimeType: { type: String, trim: true },
        fileType: { type: String, trim: true },
        original: { type: String, trim: true },
        thumbnail: { type: String, trim: true } 
    }],
    contactPerson: {
        name: { type: String, trim: true },
        title: { type: String, trim: true },
        email: { type: String, trim: true }
    },
    stepsCompleted: { type: Number, enum: [0, 1] },
    emailVerified: { type: Boolean, default: false },
    approvedByAdmin: { type: Boolean, default: false },
    createdByAdmin: {  Boolean, default: false },
    notableClients: { type: String, trim: true },
    caseStudies: { type: String, trim: true },
    retainerBasedFeeUSD: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.projectStartingFee_USD.server, index: true, sparse: true },
    projectBasedFeeUSD: { type: String, enum: Config.APP_CONSTANTS.USER_CONSTANTS.projectStartingFee_USD.server, index: true, sparse: true },
    services: { type: String, trim: true },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    //Brand Stats
    projectsCreated: { type: Number },
    shortlistedSpCount: { type: Number },
    hiredSpCount: { type: Number },
    //SP Stats
    applicationsCount: { type: Number },
    shortlistedTimes: { type: Number },
    hiredTimes: { type: Number },
    lastOnlineAt: { type: Date, default: new Date() },
    // SP Bank Account Details Below
    bankAccDetails: {
        accountName: { type: String, trim: true },
        accountNumber: { type: String, trim: true },
        bankName: { type: String, trim: true },
        bankAddress: { type: String, trim: true },
        bankCode: { type: String, trim: true },
        swiftCode: { type: String, trim: true },
        country: { type: String, trim: true }
    }

},{
    timestamps : true
});


module.exports = mongoose.model('Users', Users);