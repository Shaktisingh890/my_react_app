var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('../../constant');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}
var lastMod = require('../lastModPlugin');

var Invoices = new Schema({
    proposalId: {
        type: Schema.ObjectId,
        ref: 'Proposals',
        required: true
    },
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
    hiringId: {
        type: Schema.ObjectId,
        ref: 'Hirings',
        required: true
    },
    invoice: {
        name: { type: String, trim: true },
        mimeType: { type: String, trim: true },
        fileType: { type: String, trim: true },
        original: { type: String, trim: true },
        thumbnail: { type: String, trim: true }
    },
    milestone: { type: String, trim: true, index: true, sparse: true, required: true },
    services: { type: String, trim: true, index: true, sparse: true, required: true },
    invoiceAmount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    brandCommissionPercent: { type: Number, default: 0 },
    spCommissionPercent: { type: Number, default: 0 },
    brandCommisionAmount: { type: Number, default: 0 },
    spCommissionAmount: { type: Number, default: 0 },
    totalCommissionAmount: { type: Number, default: 0 },
    payableByBrand: { type: Number, required: true }, //payable by brand
    spAmount: { type: Number, required: true },
    paymentLink: { type: String },
    stripeLinkId: { type: String },
    linkObj: { type: String }, // stringified object
    paymentStatus: {
        type: String,
        default: Config.APP_CONSTANTS.DATABASE_KEYS.paymentStatus.pending,
        enum: Config.APP_CONSTANTS.USER_CONSTANTS.paymentStatus.server
    },
    paymentMethod: {
        type: String,
        enum: Config.APP_CONSTANTS.USER_CONSTANTS.paymentMethods.server
    },
    isPaid: { type: Boolean },
    paidAt: { type: Date },
    checkoutSessionObj: { type: String }, // stringified object
    completedAt: { type: Date },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});


module.exports = mongoose.model('Invoices', Invoices);