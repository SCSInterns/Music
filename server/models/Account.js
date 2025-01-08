const mongoose = require('mongoose');

const newdueschema = new mongoose.Schema({
    academyname: {
        type: String,
        required: true
    },
    studentname: {
        type: String,
        required: true
    },
    batchname:
    {
        type: String,
        required: true
    },
    studentemail: {
        type: String,
        required: true
    },
    mobileno:
    {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    fees: {
        type: String,
        required: true
    },
    studentid: {
        type: String,
        required: true
    },
    previousdue:
    {
        type: Number,
        required: true,
        default: 0
    },
    currentdue:
    {
        type: Number,
        required: true,
        default: 0
    },
    outstandingamount:
    {
        type: Number,
        required: true,
        default: 0
    },
    installmentdate:
    {
        type: String,
        default: ""
    },
    status:
    {
        type: String,
        default: "N/A"
    }

});

const Due = mongoose.model('Student Account', newdueschema);

module.exports = Due;