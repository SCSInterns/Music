const mongoose = require("mongoose");

const SubScriptionPayment = new mongoose.Schema({
    academyname: {
        type: String,
        required: true,
    },
    adminId: {
        type: String,
        required: true
    },
    paymentdate:
    {
        type: String,
        required: true
    },
    nextpaymentdate:
    {
        type: String,
        required: true
    },
    paymentmode:
    {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },

});

module.exports = mongoose.model("SubscriptionPayment", SubScriptionPayment);
