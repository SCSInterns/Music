const mongoose = require("mongoose");

const AssignSchema = new mongoose.Schema({
    academyname: {
        type: String,
        required: true,
    },
    studentid:
    {
        type: String,
        required: true,
    },
    batchid:
    {
        type: String,
        required: true,
    },
    batchname:
    {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("AssigBatches", AssignSchema);