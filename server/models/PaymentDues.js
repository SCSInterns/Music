const mongoose = require('mongoose');

const dueschema = new mongoose.Schema({

    academyname: {
        type: String,
        required: true
    },
    studentname: {
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
    amount: {
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
    nextpaymentdate: {
        type: String,
        required: true
    },
    studentid: {
        type: String,
        required: true
    }

});

const Due = mongoose.model('Dues', dueschema);

module.exports = Due;