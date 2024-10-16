const Logo = require("../models/Logo")
const SocialLinks = require("../models/SocialLinks")
const Gallery = require("../models/Gallery")
const About = require("../models/About")
const Instrument = require('../models/Instrument')
const Event = require('../models/Event')
const Video = require('../models/Video')
const Musicacademy = require('../models/MusicAcademy')

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

// get the about content  

const getabout = async (req, res) => {
    try {
        const { academyname } = req.body
        const response = await About.findOne({ academyname: academyname })

        if (response) {
            res.status(200).json(response)
        }
        else {
            res.status(404).json({ msg: 'No images found' })
        }

    } catch (error) {
        res.status(500).json({ msg: "Server Error" })
    }
}


// get the instrument content  

const getinstruments = async (req, res) => {
    try {

        const { academyname } = req.body
        const response = await Instrument.findOne({ academyname: academyname })

        if (response) {
            res.status(200).json(response)
        }
        else {
            res.status(404).json({ msg: 'No images found' })
        }


    } catch (error) {
        res.status(500).json({ msg: "Server Error" })
    }
}


// get the event details  


const getevents = async (req, res) => {
    try {

        const { academyname } = req.body
        const response = await Event.find({ academyname: academyname })

        if (response) {
            res.status(200).json(response)
        }
        else {
            res.status(404).json({ msg: 'No events found' })
        }


    } catch (error) {
        res.status(500).json({ msg: "Server Error" })
    }
}

// get the video details  


const getvideos = async (req, res) => {
    try {

        const { academyname } = req.body
        const response = await Video.find({ academyname: academyname })

        if (response) {
            res.status(200).json(response)
        }
        else {
            res.status(404).json({ msg: 'No videos found' })
        }


    } catch (error) {
        res.status(500).json({ msg: "Server Error" })
    }
}

// get particular event details  

const knowmore = async (req, res) => {

    try {
        const { academyname, id } = req.body
        const response = await Event.find({ academyname: academyname, _id: id })
        if (response) {
            res.status(200).json(response)
        }
        else {
            res.status(404).json({ msg: 'No events details found' })
        }


    } catch (error) {
        res.status(500).json({ msg: "Server Error" })
    }

}


// get the footer details  

const academydetails = async (req, res) => {
    try {
        const { academyname } = req.body
        const response = await Musicacademy.find({ academy_name: academyname })
        if (response) {
            res.status(200).json(response)
        }
        else {
            res.status(404).json({ msg: 'No details found' })
        }
    } catch (error) {
        res.status(500).json({ msg: "Server Error" })
    }

}


const sociallinks = async (req, res) => {
    try {
        const { academyname } = req.body
        const response = await SocialLinks.find({ academyname: academyname })
        if (response) {
            res.status(200).json(response)
        }
        else {
            res.status(404).json({ msg: 'No links found' })
        }
    } catch (error) {
        res.status(500).json({ msg: "Server Error" })
    }

}





module.exports = { fetchlogo, setsociallinks, getimages, getabout, getinstruments, getevents, knowmore, getvideos, academydetails, sociallinks }
