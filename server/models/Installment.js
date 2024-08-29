const mongoose = require("mongoose");
const { Schema } = mongoose;

const InstallmentSchema = new Schema(
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
        course : {
            type : String , 
            required : true
        } ,
        amount : { 
            type : String , 
            required :true
        } ,
        enrollmentDate:
        {
            type: String,
            required : true
        },
        paymentmode : {
            type: String , 
            required : true
        } , 
        nextPaymentDate: {
            type: String ,
            required: true
        }

    }
)

module.exports = mongoose.model('Installment', InstallmentSchema);