const mongoose = require("mongoose");

const MCredSchema = new mongoose.Schema({
    mail:
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
    app_password:
    {
        type: "String",
        required: true,
        unique: true
    },
})

module.exports = mongoose.model("GoogleCred", MCredSchema);
