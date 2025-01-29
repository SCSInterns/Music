const mongoose = require('mongoose');

const EventMngSchema = new mongoose.Schema({
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
    occurancetype:
    {
        type: String,
        required: true
    },
    venueid:
    {
        type: String,
    },
    seatlayoutid:
    {
        type: String,
    },
    ticketid:
    {
        type: String
    }
})

const EventMng = mongoose.model('EventMng', EventMngSchema);