const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    academyname: {
        type: String,
        required: true
    },
    studentname: {
        type: String,
        required: true
    },
    batchname: {
        type: String,
        required: true
    },
    studentemail: {
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
    paymentmode: {
        type: String,
        required: true
    },
    paymentdate: {
        type: String,
        required: true
    },
    studentid: {
        type: String,
        required: true
    },
    transactionamount:
    {
        type: Number,
        default: 0
    },
    installmentdate:
    {
        type: String,
        default: ""
    }
});

const Due = mongoose.model('Student Transaction', transactionSchema);

module.exports = Due;