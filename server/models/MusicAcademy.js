const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminschema = new Schema({
    academy_name: {
        type: String,
        required: true
    },
    academy_address: {
        type: String,
        required: true
    },
    academy_city: {
        type: String,
        required: true,
    },
    academy_state: {
        type: String,
        required: true,
    },
    academy_pincode: {
        type: String,
        required: true,
    },
    academy_contactno: {
        type: String,
        required: true
    } ,
    name : 
    {
        type:String , 
        required : true , 
        default : "to be update  "
    } , 
    address : 
    {
        type:String , 
        required : true , 
        default : "to be update "
    } , 
    contactno : 
    {
        type:String , 
        required : true , 
        default : " to be update "
    }
    
});

module.exports = mongoose.model('MusicAcademyDetails', adminschema);