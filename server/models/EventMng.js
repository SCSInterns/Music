const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    planName: { type: String, required: true },
    pricePerSeat: { type: Number, required: true },
    maxSeats: { type: Number, required: true },
});

const EventMngSchema = new mongoose.Schema({
    eventname: {
        type: String,
        required: true
    },
    banner: {
        type: String,
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
    seatlayouturl:
    {
        type: String,
    },
    ticketid: {
        type: String
    },
    venuetype:
    {
        type: String,
    },
    totalSeats:
    {
        type: Number,
    },
    plans: [PlanSchema],
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
