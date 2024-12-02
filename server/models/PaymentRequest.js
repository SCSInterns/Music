const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentRequest = new Schema(
    {
        studentId: {
            type: String,
            required: true
        },
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
        // installment date 
        enrollmentDate:
        {
            type: String,
            required: true
        },
        paymentmode: {
            type: String,
            required: true
        },
        paymentDate: {
            type: String,
            required: true
        },
        TransactionId:
        {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: 'To be Updated'
        }

    }
)

module.exports = mongoose.model('PaymentRequest', PaymentRequest);