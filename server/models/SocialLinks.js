const mongoose = require("mongoose");
const { Schema } = mongoose;

const SocialLinks = new Schema({
    academyname:
    {
        type: String,
        required: true
    },
    instagram:
    {
        type: String,
        required: true
    },
    youtube:
    {
        type: String,
        required: true
    },
    facebook:
    {
        type: String,
        required: true
    },
    whatsapp:
    {
        type: String,
        required: true
    },
    mail:
    {
        type: String,
        required: true
    },

})

module.exports = mongoose.model('SocialLink', SocialLinks);