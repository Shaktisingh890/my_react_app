var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('../../constant');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}
var lastMod = require('../lastModPlugin');

var Notifications = new Schema({
  userId: {
    type: Schema.ObjectId,
    ref: 'Users',
    required: true
  },
  sentBy: {
    type: Schema.ObjectId,
    ref: 'Users'
  },
  notificationTime: { type: Date, default: Date.now(), required: true },
  notificationType: { type: String, trim: true, required: true },
  flag: { type: Number, required: true },
  screen: { type: String },
  extraData: { type: Object },
  isViewed: { type: Boolean, default: false },
  isRead: { type: Boolean, default: false },
  message: { type: String, trim: true, index: true, default: null, sparse: true },
  notifyLaterTime: { type: Date },
  isUrlAvailable : { type: Boolean, default: false },
  url:{ type: String, trim: true, index: true, default: null },
  isArchived: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }
},{
    timestamps : true
});

module.exports = mongoose.model('Notifications', Notifications);