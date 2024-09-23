const mongoose = require("mongoose");
const { Schema } = mongoose; 

const Logo = new Schema({ 
    academyname : 
    {
        type : String , 
        required : true
    } , 
    link : { 
        type : String , 
        required : true
    }
}) 

module.exports = mongoose.model('Logo', Logo);