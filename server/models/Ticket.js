const mongoose = require("mongoose")

const TicketSchema = new mongoose.Schema({
    academyname:
    {
        type: String,
        required: true
    },
    academyid:
    {
        type: String,
        required: true
    },
    ticketprice:
    {
        type: Number,
    }

})

module.exports = mongoose.model("Ticket", TicketSchema)
