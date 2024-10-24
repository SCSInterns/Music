const Form = require("../models/Form")
const User = require("../models/User")


// basic info 

const profilecontroller = async (req, res) => {

    const { studentid, academyname } = req.body

    try {

        const user = await User.find({ _id: studentid, academyname: academyname })

        if (user) {
            const email = user[0].email
            if (!email) {
                return res.status(404).json({ msg: "Email not found " })
            }
            const details = await Form.findOne({ academy_name: academyname, "additionalFields.formdata.Email": email })
            if (details) {
                return res.status(200).json(details)
            }
            else {
                return res.status(404).json({ msg: "User details not match " })
            }
        } else {
            return res.status(404).json({ msg: "No user profile found " })
        }
    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }

}


module.exports = { profilecontroller }