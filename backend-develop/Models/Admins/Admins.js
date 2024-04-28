const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Config = require('../../constant');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}
const lastMod = require('../lastModPlugin');

const LoginAttempts = new Schema({
    timestamp: {type: Date, default: Date.now},
    validAttempt: {type: Boolean, required: true},
    ipAddress: {type: String, required: true}
});

const Admins = new Schema({
    name: {type: String, trim: true, index: true, default: null, sparse: true},
    email: {type: String, trim: true, unique: true, index: true},
    accessToken: {type: String, trim: true, index: true, unique: true, sparse: true},
    password: {type: String, required:true},
    passwordResetToken: {type: String, trim: true, unique: true, sparse:true},
    registrationDate: {type: Date, default: Date.now, required: true},
    // roleId : {
    //     type: Schema.ObjectId,
    //     ref: 'Roles'
    // },
    isSuperDuperAdmin : {type : Boolean , default : false },
    loginAttempts: [LoginAttempts]
},{
    timestamps : true
});


module.exports = mongoose.model('Admins', Admins);