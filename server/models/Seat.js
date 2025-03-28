const mongoose = require('mongoose');

const PlanType = new mongoose.Schema({
    planname: {
        type: String,
    },
    planprice: {
        type: Number
    }
})

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
    seatingorientation:
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
        type: Array,
        required: true
    },
    maxSeatsPerPartition:
    {
        type: Array,
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
    },
    venueid:
    {
        type: String,
        required: true
    },
    planlayout: [PlanType]
})

const SeatLayout = mongoose.model('Seat Layout', SeatSchema);

module.exports = { SeatLayout }