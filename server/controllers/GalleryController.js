const Image = require("../models/Gallery");


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

module.exports = { saveImageUrls }
