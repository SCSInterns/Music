const mongoose = require("mongoose");

const StatsSchema = new mongoose.Schema({
    academyname: {
        type: String,
        required: true,
    },
    students_enroll: {
        type: Number,
        required: true
    }, 
    instrument_cousre_offered : 
    { 
        type: Number,
        required: true
    } ,
    Certified_Instructors : 
    { 
        type: Number,
        required: true
    } , 
    Years_of_Operation : 
    { 
        type: Number,
        required: true
    }
})


module.exports = mongoose.model("Stats", StatsSchema);
