const mongoose = require("mongoose");
const { Schema } = mongoose; 

const Video = new Schema({ 
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

module.exports = mongoose.model('Video', Video);