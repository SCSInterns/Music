const mongoose = require("mongoose");
const { Schema } = mongoose;

const Qrcode = new Schema({
    academyname:
    {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('AcademyQr', Qrcode);