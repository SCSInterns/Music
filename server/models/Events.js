const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    eventname:
    {
        type: String,
        required: true
    },
    eventcategory:
    {
        type: String,
        required: true
    },
    description:
    {
        type: String,
        required: true
    },
    occurancetype:
    {
        type: String,
        required: true
    },
    date:
    {
        type: [String],
        required: true
    },
    time:
    {
        type: [String],
        required: true
    },


})

module.exports = mongoose.model('Event Management', EventSchema);