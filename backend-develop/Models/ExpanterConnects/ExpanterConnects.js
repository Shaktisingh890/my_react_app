var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('../../constant');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}
var lastMod = require('../lastModPlugin');

var ExpanterConnects = new Schema({
    brandId: {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    serviceProviderEmail: { type: String, trim: true, index: true, sparse: true },
    otherDetails: { type: String }, // stringified object
    isDeleted: { type: Boolean, default: false }

},{
    timestamps : true
});


module.exports = mongoose.model('ExpanterConnects', ExpanterConnects);