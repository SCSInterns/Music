const dotenv = require("dotenv");
dotenv.config();
const Location = require("../models/EventLocations")
const PaymentCreds = require("./RazorPayAcademyCred")
const { GoogleGenerativeAI } = require("@google/generative-ai");
const EventPaymentCreds = require("../models/EventPaymentCreds");
const Event = require("../models/EventMng");
const { redis } = require("../RedisInitalitation")
const UserEmailsMarketing = require("../models/UserEmailsMarketing")
const Emailc = require("../controllers/emailc");
const EventLocations = require("../models/EventLocations");

// call this at publish time of event 
const addeventinredis = async (eventdetails, hashKey) => {
    const eventid = eventdetails._id;
    const existing = await redis.hget(hashKey, eventid)
    if (existing) {
        return
    }
    await redis.hset(hashKey, eventid, JSON.stringify({
        eventdetails
    }));
}


// add the event at time of publishing by admin 
const geteventinredis = async () => {
    const hashkey = "events"
    const events = await Event.find()
    for (const event of events) {
        addeventinredis(event, hashkey)
    }
}

geteventinredis()


const token = process.env.googleapi;

const genAI = new GoogleGenerativeAI(token);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateAIDescription = async (req, res) => {
    try {
        const { eventName, venue, eventDates, time, occurrence, highlights, audience } = req.body;

        const prompt = `
      Write a compelling and engaging description of an event for potential users in 200 words. 
      The description should include the following details:

      Event Name: ${eventName || "MusicBee"}
      Venue: ${venue || "Hk Town Hall , Ahmedabad"}
      Date(s): ${eventDates || "13th March 2025"}
      Time: ${time || "5pm to 9pm"}
      Occurrence Type: ${occurrence || "Single Day"}
      Event Highlights: ${highlights || " - Best DJ set for event - In the heart of Ahmedabad - Free drinks - Free WiFi - Dance floor - Free parking -Neon lights -Photo booths"}
      Audience: ${audience || "All above 10+ years old"}
      
      Registration or Attendance Details: Mention if registration is required, tickets are needed, or if it's free.

      Ensure the tone is friendly, informative, and appealing. Use dynamic language to generate excitement and emphasize the benefits of attending the event. 
      If any details are missing (e.g., time, venue), politely acknowledge that they will be updated soon. 
      Make the description concise but engaging enough to captivate the audience.

      Example Output:
      'Join us for ${eventName || "[Event Name]"}, an unforgettable experience at ${venue || "[Venue]"}. 
      Happening on ${eventDates || "[Date(s)]"} from ${time || "[Time]"}, this ${occurrence || "[Occurrence]"} event is perfect for ${audience || "[Audience]"}. 
      Don’t miss out on ${highlights || "[Highlights]"}. Register now!'
    `;

        const result = await model.generateContent(prompt);
        const description = result.response.text();
        res.status(200).json({
            success: true,
            description: description,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// set venue details  
const createVenueDetails = async (req, res) => {
    try {

        const { venuename, city, state, pincode, maplink, role } = req.body

        if (role !== "Admin") {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const newvenue = new Location({
            venuename: venuename,
            city: city,
            state: state,
            pincode: pincode,
            maplink: maplink,
        })

        const response = await newvenue.save();

        return res.status(201).json(response);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// get venue details  

const getVenueDetails = async (req, res) => {
    try {

        const { role } = req.body

        if (role !== "Admin") {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const venues = await Location.find();
        return res.status(200).json(venues);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


// time conversion 
function convertToIST(utcDateString) {
    const date = new Date(utcDateString);
    const options = { timeZone: "Asia/Kolkata", hour12: false, hour: "2-digit", minute: "2-digit" };
    return date.toLocaleTimeString("en-IN", options);
}

// create event details -- to do 
const createEventDetails = async (req, res) => {
    try {
        const { academyname, eventName, venueid, eventDates, startTime, endTime, occurrence, eventCategory, role, venuetype } = req.body

        if (role !== "Admin") {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const formatteddate = eventDates[0].split("-").reverse().join("-")
        const formattedstarttime = convertToIST(startTime)
        const formattedendtime = convertToIST(endTime)

        const newapplication = new Event({
            academyname: academyname,
            eventname: eventName,
            eventcategory: eventCategory,
            occurancetype: occurrence,
            eventdescription: "N/A",
            seatlayoutid: "N/A",
            ticketid: "N/A",
            venuetype: venuetype,
            eventSchedule: [{ date: formatteddate, startTime: formattedstarttime, endTime: formattedendtime, venueid: venueid }]

        })
        const response = await newapplication.save();
        if (response) {
            return res.status(201).json(response);
        }
        else {
            return res.status(500).json({ error: "Error in creating event" });
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

}

const eventcreds = async (razorpaykey, razorpayid, qrcodeurl, academyid, eventid, type) => {
    if (type === "Both" || type === "Razorpay") {
        const ekey = PaymentCreds.encrypt(razorpaykey)

        const eid = PaymentCreds.encrypt(razorpayid)

        if (type === "Razorpay") {
            const newcreds = new EventPaymentCreds({
                eventId: eventid,
                razorpayId: eid,
                razorpayKey: ekey,
                qrcode: "none",
                type: "razorpay",
                academyId: academyid,
            })
            await newcreds.save()
            return newcreds
        } else {
            const newcreds = new EventPaymentCreds({
                eventId: eventid,
                razorpayId: eid,
                razorpayKey: ekey,
                qrcode: qrcodeurl,
                type: "both",
                academyId: academyid,
            })
            await newcreds.save()
            return newcreds
        }
    } else {
        const newcreds = new EventPaymentCreds({
            eventId: eventid,
            razorpayId: "none",
            razorpayKey: "none",
            qrcode: qrcodeurl,
            type: "manual",
            academyId: academyid,
        })
        await newcreds.save()
        return newcreds
    }
}

// insert pricing plans in case of event creation using layout 

const insertPricingPlans = async (req, res) => {
    try {
        const { plans, eventid } = req.body
        const event = await Event.findOne({ _id: eventid })

        var totalseats = 0

        plans.forEach(plan => {
            totalseats += Number(plan.maxSeats)
        })

        if (event) {
            event.plans = plans
            event.totalSeats = totalseats
            const response = await event.save()
            if (response) {
                return res.status(201).json(response)
            } else {
                return res.status(500).json({ error: "Error in inserting pricing plans" })
            }
        } else {
            return res.status(404).json({ error: "Event not found" })
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }

}

const createExtraDetails = async (req, res) => {
    try {
        const { role, id, Sponsers, Coupon, Group, TermsAndConditions, ContactInformation, description, agefree } = req.body;

        if (role !== "Admin") {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        event.ExtraDetailsSChema = {
            termsandconditions: TermsAndConditions,
            contatinformation: ContactInformation,
        };
        event.coupon = Coupon;
        event.groupdiscount = Group;
        event.eventdescription = description;
        event.sponserstickets = Sponsers;
        event.agefreetickets = agefree;
        const updatedEvent = await event.save();
        return res.status(200).json(updatedEvent);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getEventDetails = async (req, res) => {
    try {

        const { id } = req.body

        const event = await Event.findOne({ _id: id });

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        return res.status(200).json(event)


    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


const StoreCreds = async (req, res) => {
    const { role, id, rid, rkey, qrurl, type } = req.body

    if (role !== "Admin") {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    const event = await Event.findOne({ _id: id })

    if (!event) {
        return res.status(404).json({ error: "Event not found" });
    }

    event.paymentcreds = {
        razorpayId: rid,
        razorpayKey: rkey,
        qrcode: qrurl,
        type: type
    };

    const result = await event.save()

    if (result) {
        return res.status(200).json({ msg: "Payment credentials stored successfully" })
    } else {
        return res.status(500).json({ error: "Error in storing payment credentials" })
    }

}

// handle publish event 

const publishEvent = async (req, res) => {
    try {
        const { role, id } = req.body

        if (role !== "Admin") {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const event = await Event.findOne({ _id: id })

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        event.live = true

        const result = await event.save()

        const venue = result?.eventSchedule[0]?.venueid
        if (venue) {
            const locationcity = await EventLocations.findOne({ _id: venue })
            if (locationcity) {
                const marketedusers = await UserEmailsMarketing.find({ location: locationcity.city })
                for (const users of marketedusers) {
                    const mail = await sendEmail(users.email)
                }
                const allusers = await UserEmailsMarketing.find({ location: "All" })
                for (const users of allusers) {
                    const mail = await sendEmail(users.email)
                }
            }
        }
        if (result) {
            addeventinredis(event, "events")
            return res.status(200).json({ msg: "Event published successfully" })
        } else {
            return res.status(500).json({ error: "Error in publishing event" })
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

}

// add email for marketing 

const addEmail = async (req, res) => {
    try {
        const { email, location } = req.body;
        if (!email || !location) {
            return res.status(400).json({ error: "Please provide email and location" });
        }
        const newReq = new UserEmailsMarketing({
            email: email,
            location: location
        })
        const response = await newReq.save();
        if (response) {
            return res.status(201).json(response);
        } else {
            return res.status(500).json({ error: "Error in adding email" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


// send marketing email 

const sendEmail = async (mailc) => {
    try {
        const mail = await Emailc.sendsubscribemail(mailc)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

}

module.exports = { generateAIDescription, createVenueDetails, getVenueDetails, eventcreds, createEventDetails, insertPricingPlans, createExtraDetails, getEventDetails, StoreCreds, publishEvent, addEmail };
