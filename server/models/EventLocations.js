const mongoose = require('mongoose');

const EventLocationSchema = new mongoose.Schema({
    venuename:
    {
        type: String,
        required: true
    },
    city:
    {
        type: String,
        required: true
    },
    state:
    {
        type: String,
        required: true
    },
    pincode:
    {
        type: Number,
        required: true
    },
    maplink:
    {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('EventLocation', EventLocationSchema); 