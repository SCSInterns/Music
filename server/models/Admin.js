const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminschema = new Schema({
    academy_name: {
        type: String,
        required: true
    },
    academy_username: {
        type: String,
        required: true , 
         default : 'To be updated by admin '
    },
    academy_password: {
        type: String,
        required: true , 
        default : 'To be updated by admin '
    },
    academy_email: {
        type: String,
        required: true,
        unique: true
    } , 
    academy_access : 
    {
        type:String , 
        required: true , 
        default : " To be updated by admin "
    } , 
    academy_id : 
    {
        type:String , 
        default: 'none' 
    } , 
    academy_url:{
        type : String , 
        default : 'none' 
    }
});

module.exports = mongoose.model('Admin', adminschema);