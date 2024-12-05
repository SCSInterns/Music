const mongoose = require("mongoose");

const CredSchema = new mongoose.Schema({
    razorpay_id:
    {
        type: "String",
        required: true,
        unique: true
    },
    academyname:
    {
        type: "String",
        required: true,
    },
    razorpay_key:
    {
        type: "String",
        required: true,
        unique: true
    },
})

module.exports = mongoose.model("RazorParCred", CredSchema);
