const Ticketmodel = require("../models/Ticket")
const Event = require("../models/EventMng")
const { kafka } = require("../Kafka")
const { Partitioners } = require("kafkajs")
const { redis } = require("../RedisInitalitation")
const Emailc = require("./emailc")
const Qrcode = require("./QrcodeController")
const cron = require("node-cron")

const generateFutureTimestampInIST = (minutesToAdd) => {
    const currentTimeUTC = new Date();
    const ISTOffset = 5.5 * 60;
    const currentTimeIST = new Date(currentTimeUTC.getTime() + ISTOffset * 60000);
    currentTimeIST.setMinutes(currentTimeIST.getMinutes() + minutesToAdd);
    return currentTimeIST;
};

const generateCurrentISTTimestamp = () => {
    const currentTimeUTC = new Date();
    const ISTOffset = 5.5 * 60;
    return new Date(currentTimeUTC.getTime() + ISTOffset * 60000);
};


// cron job to remove the expired booking id from redis  


cron.schedule('*/10 * * * *', () => {
    console.log('Running cron job for expired booking id...');
    removeExpiredBookingId();
});


const removeExpiredBookingId = async () => {
    const allentries = await redis.hgetall("Temp-Payment-Entry");

    if (!allentries || Object.keys(allentries).length === 0) {
        console.log("No entries found");
        return;
    }

    for (const [key, value] of Object.entries(allentries)) {
        try {
            const entry = JSON.parse(value);

            if (new Date(entry.expirytime) < generateCurrentISTTimestamp()) {
                console.log("hello");
                console.log("Expired Entry:", entry);

                // Free the slot
                const eventdetails = await redis.hget("events", entry.eventId);
                console.log("Event Details:", eventdetails);
                const parsedEventDetails = JSON.parse(eventdetails);
                const plans = parsedEventDetails.eventdetails.plans;
                for (const plan of plans) {
                    if (plan.planName === entry.planName) {
                        plan.ticketbooked = Number(plan.ticketbooked) - Number(entry.NoofTicket);
                        break;
                    }
                }
                await redis.hset("events", entry.eventId, JSON.stringify(parsedEventDetails));
                await redis.hdel("Temp-Payment-Entry", key);
            }
        } catch (error) {
            console.error(`Error parsing JSON for key ${key}:`, error);
        }
    }
};


// kafka producer 

const runProducer = async (topic, ticketData) => {
    try {
        const location = ticketData.location.toLowerCase();
        const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
        await producer.connect();
        console.log(" Producer connected");

        // Send message
        const response = await producer.send({
            topic: topic,
            key: "EventBooking",
            messages: [{ value: JSON.stringify(ticketData) }],
            partition: location === "ahmedabad" ? 0 : 1
        });
        await producer.disconnect();
    } catch (error) {
        console.error("Producer Error:", error);
    }
};



// groups of consumer 

// availability 

// Kafka Consumer for Availability Check
const availabilityConsumer = async (ticketRequest) => {
    try {
        const details = await redis.hget("events", ticketRequest.eventId);
        if (!details) {
            console.log("Event not found in Redis cache.");
            return null;
        }
        const formattedData = JSON.parse(details);
        const plans = formattedData.eventdetails?.plans || [];

        for (const plan of plans) {
            if (plan.planName === ticketRequest.planName) {
                const bookedSeats = await plan.ticketbooked;
                if (plan.maxSeats > bookedSeats) {
                    // Proceed with payment process
                    await runProducer("ProcessPayment", ticketRequest);

                    // temp seat entry holding for 10 min  -- start from here



                    return { status: "Available", ticketRequest };
                } else {
                    console.log("No tickets available.");
                    return { status: "Unavailable" };
                }
            }
        }
        return { status: "Plan Not Found" };
    } catch (error) {
        console.error("Availability Consumer Error:", error);
        return { status: "Error", error };
    }
};

// Kafka Consumer for Payment Credentials
const paymentConsumer = async (ticketRequest) => {
    try {
        const details = await redis.hget("events", ticketRequest.eventId);
        if (!details) {
            console.log("Event not found in Redis cache.");
            return null;
        }
        const formattedData = JSON.parse(details);
        const paymentCreds = formattedData.eventdetails?.paymentcreds;

        if (!paymentCreds) {
            console.log("Payment credentials not found.");
            return null;
        }
        return { status: "Payment Ready", paymentCreds };
    } catch (error) {
        console.error("Payment Consumer Error:", error);
        return { status: "Error", error };
    }
};


// mailing  


// update stats  


// store the tickets in array format and then do bulk write ( 10 tickets in 1 time ) 


// booking 
const booking = async (req, res) => {
    try {
        const ticketData = req.body;
        await runProducer("PaymentEntry", ticketData);
        return res.status(200).json({ message: "Ticket Booked Successfully" });
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};


// step 1 -- get payment creds and availabilty through redis 
const getPaymentCreds = async (req, res) => {
    try {
        const ticketRequest = req.body;
        const availabilityResponse = await availabilityConsumer(ticketRequest);
        if (availabilityResponse.status !== "Available") {
            return res.status(400).json({ message: "Tickets not available" });
        }
        const paymentResponse = await paymentConsumer(ticketRequest);
        if (!paymentResponse || !paymentResponse.paymentCreds) {
            return res.status(400).json({ message: "Payment credentials not found" });
        }

        // generate six digit booking id 
        const bookingid = Qrcode.generateAlphanumericCode()

        // 10 min later time out for booking id  
        const expirytime = generateFutureTimestampInIST(10);

        const details = { bookingid, expirytime, ...ticketRequest };

        // store the ticket in redis with key as bookingid  
        const newTicket = await redis.hset("Temp-Payment-Entry", bookingid, JSON.stringify(details));

        // decrease the seat limit 

        const eventdetails = await redis.hget("events", ticketRequest.eventId)
        const parsedEventDetails = JSON.parse(eventdetails);
        const plans = parsedEventDetails.eventdetails.plans;
        for (const plan of plans) {
            if (plan.planName === ticketRequest.planName) {
                plan.ticketbooked = Number(plan.ticketbooked) + Number(ticketRequest.NoofTicket);
                break;
            }
        }
        await redis.hset("events", ticketRequest.eventId, JSON.stringify(parsedEventDetails));

        if (!newTicket) {
            return res.status(400).json({ message: "Error storing ticket in Redis" });
        }
        res.json({
            message: "Payment Credentials Retrieved",
            bookingid: bookingid,
            paymentCreds: paymentResponse.paymentCreds,
            expirytime: expirytime
        });
    } catch (error) {
        console.error("Payment Creds API Error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// setp 2 -- if payment done then run kafka services 
const paymentSuccess = async (req, res) => {
    try {
        const ticketRequest = req.body;
        const eventId = ticketRequest.eventId;
        const planName = ticketRequest.planName;
        const paymentStatus = ticketRequest.paymentStatus;
        const paymentAmount = ticketRequest.paymentAmount;

        // proceed events  -- start from here   




    } catch (error) {
        console.error("Error Processing Tickets:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }

}

// step 3 

const paymentEntryConsumer = async () => {
    try {
        const consumer = kafka.consumer({ groupId: "ticket-group8" });
        await consumer.connect();
        console.log("Payment Entry Consumer Connected to Kafka");
        await consumer.subscribe({ topic: "PaymentEntry", fromBeginning: true });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                // bulk write to database 
                const answer = await redis.hlen("payment-entry");

                if (answer > 9) {
                    const plans = await redis.hvals("payment-entry");
                    for (const plan of plans) {
                        try {
                            const parsed = JSON.parse(plan);
                            const newEntry = new Ticketmodel(parsed)
                            await newEntry.save()
                        } catch (error) {
                            console.error("Error parsing JSON:", error);
                        }
                    }
                    await redis.del("payment-entry");
                }

                // new Entry
                const parsedMessage = JSON.parse(message.value.toString());
                const hashkey = "payment-entry"
                const redisKey = `payment:${parsedMessage.eventId}:${Date.now()}`;
                await redis.hset(hashkey, redisKey, JSON.stringify(parsedMessage));
                console.log(`Stored in Redis with key: ${redisKey}`);



                // find event details  

                const eventdetails = await redis.hget("events", parsedMessage.eventId)

                const parsedEventDetails = JSON.parse(eventdetails);

                const eventname = parsedEventDetails.eventdetails.eventname

                const sendData = {
                    ticketid: redisKey,
                    attendes: parsedMessage.NoofTicket,
                    amount: parsedMessage.Amount,
                    eventid: parsedMessage.eventId,
                    eventname: eventname,
                    location: parsedMessage.location
                }
                setTimeout(() => {
                    runProducer("Qrcode", sendData)
                }, 1000);
            },
        });
    } catch (error) {
        setTimeout(startConsumer, 5000);
        console.error("Consumer Error:", error);
    }
};

// step 4 
const generateTicketQr = async () => {
    try {
        const consumer = kafka.consumer({ groupId: "QrcodeGenerator" });
        await consumer.connect();
        console.log("QrcodeGenerator Consumer Connected to Kafka");
        await consumer.subscribe({ topic: "Qrcode", fromBeginning: true });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const parsedMessage = JSON.parse(message.value.toString());
                const ticketid = parsedMessage.ticketid
                const attendes = parsedMessage.attendes
                const amount = parsedMessage.amount
                const eventid = parsedMessage.eventid
                const eventname = parsedMessage.eventname

                await Qrcode.generateqrforeventpass(ticketid, attendes, amount, eventid, eventname)

                // next step   

                const redisentry = await redis.hget("payment-entry", ticketid)
                const redisevent = await redis.hget("events", eventid)
                const entry = JSON.parse(redisentry)
                const event = JSON.parse(redisevent)

                const eventdata = event.eventdetails

                const sendData = {
                    academyname: eventdata.academyname, email: entry.Email, bgcover: eventdata.banner, qrcode: entry.qrcode, eventname: eventdata.eventname, planname: entry.planName, attendene: entry.NoofTicket, eventdate: eventdata.eventSchedule[0].date, eventtime: eventdata.eventSchedule[0].startTime, eventvenue: "TownHall , Ahmedabad", amount: entry.Amount, bookingid: entry.bookingid, location: entry.location, eventid: eventid
                }

                setTimeout(() => {
                    runProducer("TicketsMailing", sendData)
                }, 1000);

            },
        });


    } catch (error) {
        console.log("Ticket Qr consumer error", error)
    }
}


//step 5 
const SendTicketEmail = async () => {
    try {
        const consumer = kafka.consumer({ groupId: "MailConsumer" });

        await consumer.connect()
        console.log("Mail Consumer Connected to Kafka")

        await consumer.subscribe({ topic: "TicketsMailing", fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const parsedMessage = JSON.parse(message.value.toString());
                const mailsending = await Emailc.sendeventpass(parsedMessage.academyname, parsedMessage.email, parsedMessage.bgcover, parsedMessage.qrcode, parsedMessage.eventname, parsedMessage.planname, parsedMessage.attendene, parsedMessage.eventdate, parsedMessage.eventtime, parsedMessage.eventvenue, parsedMessage.amount, parsedMessage.bookingid)

                const sendData = {
                    eventid: parsedMessage.eventid,
                    planname: parsedMessage.planname,
                    location: parsedMessage.location
                }

                setTimeout(() => {
                    runProducer("UpdateStats", sendData)
                }, 1000);

            }
        })


    } catch (error) {
        console.error("Consumer Error:", error);
    }
}

// step 6 
const UpdateStats = async () => {
    try {
        const consumer = kafka.consumer({ groupId: "UpdateStatsConsumer" });

        await consumer.connect()
        console.log("UpdateStats Consumer Connected to Kafka")

        await consumer.subscribe({ topic: "UpdateStats", fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const parsedMessage = JSON.parse(message.value.toString());
                const eventid = parsedMessage.eventid;
                const planname = parsedMessage.planname;

                try {
                    const redisentry = await redis.hget("events", eventid);
                    const eventDetails = JSON.parse(redisentry);
                    if (eventDetails && eventDetails.eventdetails && eventDetails.eventdetails.plans) {
                        const plans = eventDetails.eventdetails.plans;

                        let updated = false;

                        for (const plan of plans) {
                            if (plan.planName === planname) {
                                plan.ticketbooked = Number(plan.ticketbooked) + 1;
                                updated = true;
                                break;
                            }
                        }

                        if (updated) {
                            await redis.hset("events", eventid, JSON.stringify(eventDetails));
                            return { status: "success", updatedEvent: eventDetails };
                        } else {
                            console.log("Plan not found.");
                            return { status: "error", message: "Plan not found." };
                        }
                    } else {
                        console.log("No entry found or missing eventdetails/plans.");
                        return { status: "error", message: "No entry found or missing eventdetails/plans." };
                    }
                } catch (error) {
                    console.error("Error processing message:", error);
                    return { status: "error", message: "Error processing message." };
                }
            }

        })

    } catch (error) {
        console.error("Consumer Error:", error);
    }
}



// connect consumer 
paymentEntryConsumer()
generateTicketQr()
SendTicketEmail()
UpdateStats()




module.exports = { booking, getPaymentCreds }