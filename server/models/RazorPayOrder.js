const mongoose = require("mongoose");

const RazorpayOrders = new mongoose.Schema({
    academyname: {
        type: String,
        required: true,
    },
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true
    },
    studentId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'created'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("RazorpayOrder", RazorpayOrders);
