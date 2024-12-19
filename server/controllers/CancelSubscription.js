const Admin = require("../models/Admin");
const MusicAcademy = require("../models/MusicAcademy");
const About = require("../models/About");
const AcademyQr = require("../models/AcademyQr");
const Attendance = require("../models/Attendance");
const Batch = require("../models/Batch");
const BatchAssign = require("../models/BatchAssign");
const Banner = require("../models/Banner");
const Event = require("../models/Event");
const Form = require("../models/Form");
const Gallery = require("../models/Gallery");
const GoogleAppCred = require("../models/GoogleAppCred");
const Installment = require("../models/Installment");
const Instrument = require("../models/Instrument");
const Logo = require("../models/Logo");
const Mentors = require("../models/Mentors");
const PaymentDues = require("../models/PaymentDues");
const PaymentRequest = require("../models/PaymentRequest");
const Qrcode = require("../models/Qrcode");
const RazorPayCred = require("../models/RazorPayCred");
const RazorPayOrder = require("../models/RazorPayOrder");
const Rollno = require("../models/Rollno");
const SocialLinks = require("../models/SocialLinks");
const SpecificBatch = require("../models/SpecificBatch");
const Stats = require("../models/Stats");
const Subscription = require("../models/Supbscription");
const User = require("../models/User");
const Video = require("../models/Video");

const CancelModal = require("../models/CancelSubscription");

const cancelsubscription = async (req, res) => {

    try {

        const { academyname, role, reason, name, email, mobileno, date } = req.body;

        if (role === "Admin") {

            const admin = await Admin.findOne({ academy_email: email });

            if (email === admin.academy_email) {

                const reasonentry = new CancelModal({
                    academyname: academyname,
                    reason: reason,
                    name: name,
                    email: email,
                    mobileno: mobileno,
                    date: date,
                })

                const savedresponse = await reasonentry.save()

                if (savedresponse) {

                    await Promise.all([
                        Admin.deleteMany({ academy_name: academyname }),
                        MusicAcademy.deleteMany({ academy_name: academyname }),
                        About.deleteMany({ academyname: academyname }),
                        AcademyQr.deleteMany({ academyname: academyname }),
                        Attendance.deleteMany({ academyname: academyname }),
                        Batch.deleteMany({ academyname: academyname }),
                        BatchAssign.deleteMany({ academyname: academyname }),
                        Banner.deleteMany({ academyname: academyname }),
                        Event.deleteMany({ academyname: academyname }),
                        Form.deleteMany({ academy_name: academyname }),
                        Gallery.deleteMany({ academyname: academyname }),
                        GoogleAppCred.deleteMany({ academy_name: academyname }),
                        Installment.deleteMany({ academyname: academyname }),
                        Instrument.deleteMany({ academyname: academyname }),
                        Logo.deleteMany({ academyname: academyname }),
                        Mentors.deleteMany({ academyname: academyname }),
                        PaymentDues.deleteMany({ academyname: academyname }),
                        PaymentRequest.deleteMany({ academyname: academyname }),
                        Qrcode.deleteMany({ academyname: academyname }),
                        RazorPayCred.deleteMany({ academyname: academyname }),
                        RazorPayOrder.deleteMany({ academyname: academyname }),
                        Rollno.deleteMany({ academyname: academyname }),
                        SocialLinks.deleteMany({ academyname: academyname }),
                        SpecificBatch.deleteMany({ academyname: academyname }),
                        Stats.deleteMany({ academyname: academyname }),
                        Subscription.deleteMany({ academyname: academyname }),
                        User.deleteMany({ academyname: academyname }),
                        Video.deleteMany({ academyname: academyname }),
                    ])

                    return res.status(200).json({ msg: 'Your Subscription is canceled' })

                } else {
                    return res.status(400).json({ msg: "Error in saving data" })
                }

            } else {
                return res.status(400).json({ msg: "Access Denied . Please verify through admin mail only ." })
            }

        } else {
            return res.status(401).json({ msg: "Unauthorized access!" });
        }

    } catch (error) {
        return res.status(500).json({ msg: "Internal Server Error", error })
    }
}

module.exports = { cancelsubscription }