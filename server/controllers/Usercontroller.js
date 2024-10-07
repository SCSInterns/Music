const Logo = require("../models/Logo")
const SocialLinks = require("../models/SocialLinks")
const Gallery = require("../models/Gallery")

// get the logo for navbar 
const fetchlogo = async (req, res) => {

    try {
        const { academyname } = req.body
        const response = await Logo.findOne({ academyname: academyname })

        if (response) {
            res.status(200).json(response)
        } else {
            res.status(404).json({ msg: "Error fetching logo" })
        }

    } catch (error) {
        res.status(500).json({ msg: "Server Error" })
    }

}

// set the social media link 

const setsociallinks = async (req, res) => {
    try {
        const { academyname, role, instagram, youtube, facebook, whatsapp, mail } = req.body

        if (role === "Admin") {
            const existing = await SocialLinks.findOne({ academyname: academyname })

            if (existing) {
                existing.instagram = instagram
                existing.youtube = youtube
                existing.facebook = facebook
                existing.whatsapp = whatsapp
                existing.mail = mail

                await existing.save()

                res.status(200).json({ msg: "Updated Links", existing })
            }
            else {
                const newdata = await new SocialLinks({
                    academyname: academyname,
                    instagram: instagram,
                    youtube: youtube,
                    facebook: facebook,
                    whatsapp: whatsapp,
                    mail: mail
                })

                await newdata.save()

                res.status(200).json(newdata)
            }
        }
        else {
            res.status(401).json({ msg: "Unauthorized Access" })
        }
    }
    catch (error) {
        res.status(500).json({ msg: "Server Error" })
    }

}

// get the images for gallery 

const getimages = async (req, res) => {
    const { academyname } = req.body
    const response = await Gallery.findOne({ academyname: academyname })

    if (response) {
        res.status(200).json(response)
    }
    else {
        res.status(404).json({ msg: 'No images found' })
    }
}

module.exports = { fetchlogo, setsociallinks , getimages }
