const Installement = require("../models/Installment")
const Paymnetdue = require("../models/PaymentDues")
const Handlepaymentstats = require('./Handlepaymentstats')


// fetch the details of payment stats for user 

const fetchpaymentsats = async (req, res) => {

    try {

        const { academyname, studentid } = req.body

        const stats = await Paymnetdue.findOne({ academyname: academyname, studentid: studentid })

        if (stats) {

            return res.status(200).json(stats)

        } else {
            return res.status(404).json({ msg: "No data found " })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });

    }
}


module.exports = { fetchpaymentsats }