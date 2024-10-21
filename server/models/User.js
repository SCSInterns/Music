const mongoose = require("mongoose");

const Userschema = new mongoose.Schema({
    academyname: {
        type: String,
        required: true,
    },
    email:
    {
        type: String,
        required: true,
        unique: true
    },
    username:
    {
        type: String,
        required: true,
    },
    password:
    {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("User", Userschema);
