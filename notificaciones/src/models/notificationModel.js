const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user_id:  { type: Number,  required: true },
    type:     { type: String,  required: true, enum: ['appointment', 'reminder', 'alert'] },
    message:  { type: String,  required: true },
    read:     { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);