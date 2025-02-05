const dotenv = require("dotenv");
dotenv.config();
const Location = require("../models/EventLocations")
const PaymentCreds = require("./RazorPayAcademyCred")
const { GoogleGenerativeAI } = require("@google/generative-ai");
const EventPaymentCreds = require("../models/EventPaymentCreds");
const Event = require("../models/EventMng");

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
        const { eventName, venueid, eventDates, startTime, endTime, occurrence, eventCategory, role, venuetype } = req.body

        if (role !== "Admin") {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const formatteddate = eventDates[0].split("-").reverse().join("-")
        const formattedstarttime = convertToIST(startTime)
        const formattedendtime = convertToIST(endTime)

        const newapplication = new Event({
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

module.exports = { generateAIDescription, createVenueDetails, getVenueDetails, eventcreds, createEventDetails };
