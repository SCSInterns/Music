const mongoose = require('mongoose');

const EventFormSchema = new mongoose.Schema({
    eventid:
    {
        type: String,
        required: true
    },
    name:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true
    },
    mobile:
    {
        type: String,
        required: true
    },
    gender:
    {
        type: String,
        required: true
    },
    age:
    {
        type: Number,
        required: true
    }
})


module.exports = mongoose.model('EventForm', EventFormSchema);