const mongoose = require('mongoose');

const EventMngSchema = new mongoose.Schema({
    eventname: {
        type: String,
        required: true
    },
    eventcategory: {
        type: String,
        required: true
    },
    occurancetype: {
        type: String,
        required: true
    },
    eventdescription: {
        type: String,
        required: true
    },
    seatlayoutid: {
        type: [String],
    },
    ticketid: {
        type: String
    },
    venuetype:
    {
        type: String,
    },
    eventSchedule: [
        {
            date: {
                type: String,
                required: true
            },
            startTime: {
                type: String,
                required: true
            },
            endTime: {
                type: String,
                required: true
            },
            venueid: {
                type: String,
                required: true
            }
        }
    ]
});

const EventMng = mongoose.model('EventMng', EventMngSchema);

module.exports = EventMng;
