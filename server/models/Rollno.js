const mongoose = require("mongoose");

const RollnoSchema = new mongoose.Schema({
    academyname: {
        type: String,
        required: true,
    },
    currentrollno:
    {
        type: Numer,
        required: true,
        default: 0,
    }
});

module.exports = mongoose.model("RollNo", RollnoSchema);
