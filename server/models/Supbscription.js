const mongoose = require("mongoose");

const AdminRazorpayOrders = new mongoose.Schema({
    academyname: {
        type: String,
        required: true,
    },
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true
    },
    adminId: {
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

module.exports = mongoose.model("SubscriptionRazorpay", AdminRazorpayOrders);
