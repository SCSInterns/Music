
const mongoose = require('mongoose');

const advregSchema = new mongoose.Schema({
    academyname: {
        type: String,
        required: true,
    },
    academyid: {
        type: String,
        required: true,
    },
    academycity:
    {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    advertiseid: {
        type: String,
        required: true,
    },
    advertisename: {
        type: String,
        required: true,
    },
    paymentstatus: {
        type: String,
        required: true,
    },
    bannerlink: {
        type: String,
        required: true,
    },
    websitelink: {
        type: String,
        required: true,
    },
    section:
    {
        type: String,
        required: true,
    },
    date:
    {
        type: String,
        required: true,
    },
    paymentdate:
    {
        type: String,
        required: true,
    },
    paymentmode:
    {
        type: String,
        required: true,
    },
    expirydate:
    {
        type: String,
        default: 'Pending',
        required: true
    }


});

module.exports = mongoose.model('Advertise Register', advregSchema);
