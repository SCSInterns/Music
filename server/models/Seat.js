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
    eventid:
    {
        type: String,
        required: true
    },
    noofrows:
    {
        type: Number,
        required: true
    },
    noofcol:
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

module.exports = { SeatSchema }