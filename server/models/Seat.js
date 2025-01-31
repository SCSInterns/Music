const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
    academyid: {
        type: String,
        required: true
    },
    planname:
    {
        type: String,
        required: true
    },
    priceperseat:
    {
        type: Number,
        required: true
    },
    eventid:
    {
        type: String,
        required: true
    },
    seatsorientation:
    {
        type: String,
        required: true
    },
    noofrows:
    {
        type: Number,
        required: true
    },
    noofpartition:
    {
        type: Number,
        required: true
    },
    seatsPerPartition:
    {
        type: Number,
        required: true
    },
    maxSeatsPerPartition:
    {
        type: Number,
        required: true
    },
    totalnoofseats:
    {
        type: Number,
        required: true
    },
    seatbooked:
    {
        type: Number
    }
})

const SeatLayout = mongoose.model('Seat Layout', SeatSchema);

module.exports = { SeatLayout }