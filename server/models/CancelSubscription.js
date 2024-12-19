const mongoose = require("mongoose");

const CancelSubsSchema = new mongoose.Schema({
    academyname: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    name:
    {
        type: String,
        required: true,
    },
    email:
    {
        type: String,
        required: true,
    },
    mobileno:
    {
        type: String,
        required: true,
    },
    date:
    {
        type: String,
        required: true,
    }

})

module.exports = mongoose.model("CancelSubscription", CancelSubsSchema);