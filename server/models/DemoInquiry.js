const mongoose = require("mongoose");

const DemoInquiry = new mongoose.Schema({
    academyname: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    mobileno: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "Pending"
    },

});

module.exports = mongoose.model("DemoInquiry", DemoInquiry);
