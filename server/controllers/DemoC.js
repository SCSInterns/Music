const Demo = require("../models/DemoInquiry")


const savedemodata = async (req, res) => {
    try {
        const { name, academyname, phoneno, city, email } = req.body
        const existing = await Demo.findOne({ name: name, academyname: academyname, mobileno: phoneno, city: city, email: email })

        if (existing) {
            return res.status(403).json({ msg: "Details Already Submitted . Pls Wait for Sometime 😊 " })
        } else {

            const newdemoentry = new Demo({
                name: name,
                academyname: academyname,
                mobileno: phoneno,
                city: city,
                email: email
            })

            const success = await newdemoentry.save()

            if (success) {
                return res.status(200).json({ msg: "Thank You ! We will contact you soon 🤝 " })
            }
            else {
                return res.status(404).json({ msg: "We are facing some issues , Try Again Later ⌛ " })
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getdemodata = async (req, res) => {
    try {

        const { role } = req.body

        if (role) {
            const newdata = await Demo.find()

            if (newdata) {
                return res.status(200).json(newdata)
            } else {
                return res.status(404).json({ msg: " No inquiries" })
            }

        } else {
            return res.status(404).json({ msg: "Unauthorized Access" })
        }

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = { savedemodata, getdemodata }