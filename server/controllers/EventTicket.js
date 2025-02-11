const Ticket = require("../models/Ticket")
const Event = require("../models/EventMng")
const kafka = require("../Kafka")


// kafka producer 

const runProducer = async (ticketData) => {
    const location = ticketData.location.toLowerCase()
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
        topic: 'EventTickets',
        key: "EventBooking",
        messages: [{ value: JSON.stringify(ticketData) }],
        partition: location === "Ahmedabad" ? 0 : 1
    });
    await producer.disconnect();
};


// booking 

const booking = async (req, res) => {

    try {
        const ticketData = req.body;
        await runProducer(ticketData);
        res.json({ message: 'Booking request sent to Kafka' });

    } catch (error) {
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

module.exports = { booking, runProducer }