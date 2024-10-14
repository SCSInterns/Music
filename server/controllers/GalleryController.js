const Image = require("../models/Gallery");
const Event = require("../models/Event")
const About = require("../models/About")

const saveImageUrls = async (req, res) => {
    try {
        const { academyName, imageUrls } = req.body;

        if (!academyName || !Array.isArray(imageUrls)) {
            return res.status(400).json({ message: "Academy name and image URLs are required" });
        }

        if (imageUrls.length > 10) {
            return res.status(400).json({ message: "Maximum limit of 10 images reached" });
        }

        let academyEntry = await Image.findOne({ academyname: academyName });

        if (academyEntry) {

            const count = academyEntry.imageUrls.length
            const newcount = imageUrls.length

            if (count + newcount > 10) {
                // Update existing entry
                academyEntry.imageUrls = imageUrls;
                await academyEntry.save();
                return res.status(200).json({ message: "Images updated successfully", academyEntry });
            }
            else {
                // add with previous entries 
                academyEntry.imageUrls = [...academyEntry.imageUrls, ...imageUrls];
                await academyEntry.save();
                return res.status(200).json({ message: "Images saved successfully", academyEntry });
            }


        } else {
            // Create new entry
            const newImageEntry = new Image({
                academyname: academyName,
                imageUrls,
            });

            const savedImage = await newImageEntry.save();
            return res.status(201).json({ message: "Images saved successfully", savedImage });
        }
    } catch (error) {
        console.error("Error saving or updating image URLs:", error);
        res.status(500).json({ message: "Failed to save or update image URLs" });
    }
};


const handleevents = async (req, res) => {
    try {

        const { role, imageUrl, academyname, description, eventname, date, time, location } = req.body

        if (role === "Admin") {

            const response = await new Event({
                academyname: academyname,
                eventname: eventname,
                description: description,
                imageUrl: imageUrl,
                date: date,
                time: time,
                location: location
            })

            await response.save()

            res.status(200).json(response)

        } else {
            res.status(401).json({ msg: "Unauthorized Access" })

        }

    } catch (error) {
        res.status(500).json({ message: "Failed to save or update image URLs" });
    }
}


const handleabout = async (req, res) => {
    try {

        const { role, imageUrl, academyname, description } = req.body

        if (role === "Admin") {

            const exisiting = await About.findOne({ academyname: academyname })

            if (exisiting) {
                exisiting.imageUrl = imageUrl
                exisiting.description = description

                await exisiting.save()

                res.status(200).json(exisiting)
            }
            else {

                const response = await new About({
                    academyname: academyname,
                    description: description,
                    imageUrl: imageUrl
                })

                await response.save()

                res.status(200).json(response)

            }
        } else {
            res.status(401).json({ msg: "Unauthorized Access" })

        }

    } catch (error) {
        res.status(500).json({ message: "Failed to save or update image URLs", error });
    }
}

module.exports = { saveImageUrls, handleevents, handleabout }
