const dotenv = require("dotenv");
dotenv.config();
const Location = require("../models/EventLocations")

const { GoogleGenerativeAI } = require("@google/generative-ai");

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

module.exports = { generateAIDescription, createVenueDetails, getVenueDetails };
