const Advertise = require("../models/AdvertiseApplication")
const Admin = require("../models/Admin")
const MusicAcdemyDetails = require("../models/MusicAcademy")


const featuredAcademies = async (req, res) => {

    try {
        const { city } = req.body

        const advertise = await Advertise.find({ academycity: city, section: "Featured" })
        const musicacademiesdefault = await MusicAcdemyDetails.find({ academy_city: city })

        const advertisedAcademyIds = advertise.map((ad) => ad.academyid.toString());
        const filteredMusicAcademies = musicacademiesdefault.filter(
            (academy) => !advertisedAcademyIds.includes(academy._id.toString())
        );
        if (advertise.length === 0) {

            if (musicacademiesdefault.length > 6) {
                musicacademiesdefault.splice(0, 6)
                return res.status(200).json(musicacademiesdefault)
            }
        }

        // advertise less than 6 
        if (advertise.length < 6) {
            const cuurentadvcount = advertise.length
            const required = 6 - cuurentadvcount
            const result = []
            result.push(...advertise)
            for (let i = 0; i < required; i++) {
                result.push(filteredMusicAcademies[i])
            }

            return res.status(200).json(result)
        }
        // complete advertise found for the city, return all advertise
        return res.status(200).json(advertise)
    }
    catch (error) {
        return res.status(500).json({ message: error.message, error });
    }
}

module.exports = { featuredAcademies }