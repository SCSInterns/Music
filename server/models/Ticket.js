const mongoose = require("mongoose")

const TicketSchema = new mongoose.Schema({
    eventId:
    {
        type: String,
        required: true
    },
    location:
    {
        type: String,
        required: true
    },
    Name:
    {
        type: String,
        required: true
    },
    Email:
    {
        type: String,
        required: true
    },
    Age:
    {
        type: Number,
        required: true
    },
    Mobile:
    {
        type: Number,
        required: true
    },
    Amount:
    {
        type: Number,
        required: true
    },
    planName:
    {
        type: String,
        required: true
    },
    NoofTicket: {
        type: Number,
        required: true
    },
    qrcode: {
        type: String,
        default: "N/A",
        required: true
    }

})

module.exports = mongoose.model("Ticket", TicketSchema)
