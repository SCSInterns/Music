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

});

module.exports = mongoose.model("DemoInquiry", DemoInquiry);
