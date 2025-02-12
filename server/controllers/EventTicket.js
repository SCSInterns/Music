const Ticket = require("../models/Ticket")
const Event = require("../models/EventMng")
const { kafka } = require("../Kafka")
const { redis } = require("../RedisInitalitation")

// start from here
// kafka producer 

const runProducer = async (topic, ticketData) => {
    try {
        const location = ticketData.location.toLowerCase()
        const producer = kafka.producer();
        await producer.connect();
        await producer.send({
            topic: topic,
            key: "EventBooking",
            messages: [{ value: JSON.stringify(ticketData) }],
            partition: location === "ahmedabad" ? 0 : 1
        });
        await producer.disconnect();
    } catch (error) {
        return error
    }
};


// groups of consumer 

// availability 

const availability = async (req, res) => {
    const consumer = kafka.consumer({ groupId: "ticketavailabilty-group" })
    await consumer.connect()
    await consumer.subscribe({ topics: ["CheckAvailability"] });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const ticketRequest = JSON.parse(message.value.toString());
            const details = await redis.hget("events", ticketRequest.eventId)
            if (!details) {
                return console.log("Event not found in Redis cache.");
            }
            const formatteddata = JSON.parse(details);
            const temp = formatteddata.eventdetails?.plans
            for (const tem of temp) {
                if (tem.planName === ticketRequest.planName) {
                    if (tem.maxSeats > temp.ticketbooked) {
                        // call another job to send payment order  
                        await runProducer("ProcessPayment", ticketRequest)
                    } else {
                        console.log("No tickets available.");
                    }
                }
            }
        }
    })

}

// ticket payment 
const ticketPayment = async (req, res) => {
    const consumer = kafka.consumer({
        groupId: "ticketpayment-group"
    })

    await consumer.connect()
    await consumer.subscribe({ topics: ["ProcessPayment"] });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const ticketRequest = JSON.parse(message.value.toString());
            const details = await redis.hget("events", ticketRequest.eventId)
            if (!details) {
                return console.log("Event not found in Redis cache.");
            }
            const formatteddata = JSON.parse(details);
            const temp = formatteddata.eventdetails.paymentcreds
            if (!temp) {
                return console.log("Creds Not found ")
            }

            res.status(200).json({ creds: temp });

            console.log("Sent payment creds to Kafka response topic.");

        }
    })
}


// mailing  


// update stats  


// store the tickets in array format and then do bulk write ( 10 tickets in 1 time ) 


// booking 

const booking = async (req, res) => {
    try {
        const ticketData = req.body;
        await runProducer("CheckAvailability", ticketData);

        const consumer = kafka.consumer({ groupId: "response-group" });
        await consumer.connect();
        await consumer.subscribe({ topics: ["PaymentCredsResponse"] });

        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => {
                consumer.disconnect();
                reject(res.status(504).json({ message: "Payment credentials response timeout" }));
            }, 10000);

            consumer.run({
                eachMessage: async ({ message }) => {
                    if (message.key.toString() === ticketData.userId) {
                        clearTimeout(timeout);
                        await consumer.disconnect();
                        resolve(res.json({ paymentCreds: JSON.parse(message.value.toString()) }));
                    }
                }
            });
        });

    } catch (error) {
        console.error("Error in booking:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};


module.exports = { booking, runProducer }