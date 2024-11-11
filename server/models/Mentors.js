const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
    academyname: {
        type: String,
        required: true,
    },
    name:
    {
        type: String,
        required: true,
    },
    profileimage:
    {
        type: String,
        required: true,
    },
    course:
    {
        type: [String],
        require: true,
    },
    no_of_exp:
    {
        type: Number,
        required: true
    },
    email:
    {
        type: String,
        require: true,
        unique: true
    }
})


module.exports = mongoose.model("Mentors", MentorSchema);



