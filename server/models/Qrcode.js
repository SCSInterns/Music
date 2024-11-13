const mongoose = require("mongoose");
const { Schema } = mongoose;

const QrcodeSchema = new Schema({
    academyname:
    {
        type: String,
        required: true
    },
    qrcode:
    {
        type: String,
        required: true
    },
    studentid:
    {
        type: String,
        required: true,
        unique: true
    },
    batchid:
    {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Qrcode', QrcodeSchema);