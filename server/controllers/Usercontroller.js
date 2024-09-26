const Logo = require("../models/Logo")

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

module.exports = {fetchlogo}
