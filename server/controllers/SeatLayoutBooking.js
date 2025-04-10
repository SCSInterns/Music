const Seat = require("../models/Seat")
const Event = require("../models/EventMng");
const { redis } = require("../RedisInitalitation");


// step - 1 check available and return creds
const SeatLayoutBooking = async (req, res) => {
    try {
        const { eventid, seatno } = req.body
        if (!eventid && !seatno) {
            return res.status(400).json({ message: "Please provide eventid and seatno" });
        }

        // redis  

        // const EventData = await Event.findOne({ _id: eventid })
        const details = await redis.hget("events", eventid);
        const EventData = JSON.parse(details);
        console.log(EventData)
        const bookedseats = EventData.bookedticket
        console.log(bookedseats)
        if (bookedseats.includes(seatno)) {
            return res.status(400).json({ message: "Seat already booked" });
        }

        EventData.bookedticket.push(seatno)
        await redis.hset("events", eventid, JSON.stringify(EventData));

        // return res.status(200).json({ message: "Seat booked successfully" }); 

        return res.status(200).json(EventData.paymentcreds)

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

// step - 2 create temp booking for 10 min 
const createtempticket = async (req, res) => {

}

// step - 3 confirm booking and remove temp 


module.exports = { SeatLayoutBooking }