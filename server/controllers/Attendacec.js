const Attendance = require("../models/Attendance")

const getattendance = async (req, res) => {

    try {

        const { role, academyname, batchid, studentid } = req.body

        if (role === "Admin") {

            const data = await Attendance.find({ academyname: academyname, studentid: studentid, batchid: batchid })

            if (data) {
                return res.status(200).json(data)
            } else {
                return res.status(404).json({ msg: "No records found" })
            }

        } else {
            return res.status(401).json({ msg: "Unauthorized Access" });

        }

    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }
}


module.exports = { getattendance }