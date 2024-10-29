const mongoose = require("mongoose");
const { Schema } = mongoose;

const ParticularBatch = new Schema({
    academyname: {
        type: String,
        required: true,
    },
    noofstudents:
    {
        type: Number,
        required: true,
    },
    max_noofstudents:
    {
        type: Number,
        required: true,
    },
    batchname:
    {
        type: String,
        required: true,
        unique: true
    },
    starttime:
    {
        type: String,
        required: true,
    },
    endtime:
    {
        type: String,
        required: true,
    },
    days:
    {
        type: [String], 
        required: true
    }

});

module.exports = mongoose.model("BatchesSpec", ParticularBatch);