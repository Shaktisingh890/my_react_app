var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('../../constant');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}
var lastMod = require('../lastModPlugin');

var ServiceProviders = new Schema({

    ownerId: {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    
    isDeleted: { type: Boolean, default: false }

}, {
    timestamps: true
});


module.exports = mongoose.model('ServiceProviders', ServiceProviders);