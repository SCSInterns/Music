const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema({
    academyname: {
        type: String,
        required: true,
    },
    no_of_batches_per_day:
    {
        type: Number,
        required: true
    },
    max_no_of_students_per_day:
    {
        type: Number,
        required: true
    },
    currentstudentcount:
    {
        type: Number,
        required: true,
        default: 0
    }

});

module.exports = mongoose.model("Batches", BatchSchema);