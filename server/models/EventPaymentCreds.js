const mongoose = require('mongoose');

const EventPaymentCredsSchema = new mongoose.Schema({
    eventId: { type: String },
    academyId: { type: String },
    razorpayId: { type: String },
    razorpayKey: { type: String },
    qrcode: { type: String },
    type: { type: String },
})

module.exports = mongoose.model('EventPaymentCreds', EventPaymentCredsSchema);