const Qrcode = require("../models/Qrcode")
const QR = require('qrcode');
const Attendance = require("../models/Attendance")
const Rollno = require("../controllers/RollnoController")




function getInitials(str) {
    return str
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
}



const generateqrcode = async (req, res) => {

    try {

        const { studentid, academyname, role, batchid } = req.body

        const existing = await Qrcode.findOne({ studentid: studentid, academyname: academyname })


        if (role === "Admin") {

            if (existing) {
                return res.status(404).json({ msg: " Qr code already generated for this student " })
            }

            const rollnofind = await Rollno.updaterollno(role, academyname)
            const academynameinitial = await getInitials(academyname)
            const rollno = `${academynameinitial}-${rollnofind}`
            const data = JSON.stringify({ studentid, batchid, rollno })
            const qrCodeData = await QR.toDataURL(data);

            if (qrCodeData) {

                const newidcard = new Qrcode({
                    academyname: academyname,
                    qrcode: qrCodeData,
                    studentid: studentid,
                    batchid: batchid,
                    rollno: rollno
                })

                const id = await newidcard.save()

                return res.status(200).json(id)

            } else {
                return res.status(404).json({ msg: "Error generating qr code" })
            }

        } else {
            return res.status(401).json({ msg: "Unauthorized Access" })
        }



    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }
}

const fetchqr = async (req, res) => {
    try {

        const { studentid, academyname } = req.body

        const student = await Qrcode.findOne({ studentid: studentid, academyname: academyname })

        if (student) {
            const qr = await student.qrcode

            if (qr) {
                return res.status(200).json(qr)
            }
            else {
                return res.status(404).json({ msg: "Error fetching qr code " })
            }
        }
        else {
            return res.status(404).json({ msg: "Not found" })
        }
    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });

    }
}

const attendance = async (req, res) => {
    try {
        const { studentid, academyname, role, batchid, currentrollno } = req.body;

        if (role === "Admin") {
            if (!studentid || !academyname || !batchid || !currentrollno) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const currentDate = new Date();


            const offset = 5.5 * 60 * 60 * 1000;
            const istDate = new Date(currentDate.getTime() + offset);

            // Extract the date, time, and day
            const date = istDate.toISOString().split("T")[0];
            const time = istDate.toISOString().split("T")[1].split(".")[0];
            const day = istDate.toLocaleString("en-IN", { weekday: "long" });

            const alreadyDone = await Attendance.findOne({
                studentid: studentid,
                batchid: batchid,
                date: date,
            });

            if (alreadyDone) {
                return res.status(409).json({ msg: "Attendance has already been marked for today." });
            }

            const attendanceRecord = new Attendance({
                studentid,
                academyname,
                role,
                batchid,
                date,
                time,
                day,
                currentrollno
            });

            await attendanceRecord.save();

            return res.status(201).json({ message: "Attendance logged successfully", attendanceRecord });
        } else {
            return res.status(401).json({ msg: "Unauthorized Access" });
        }
    } catch (error) {
        console.error("Error logging attendance:", error);
        return res.status(500).json({ message: "Server error occurred", error });
    }
};




module.exports = { generateqrcode, fetchqr, attendance }