const Admin = require('../models/Admin');
const Token = require('../models/Token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Email = require("./emailc")
const MusicAcademy = require('../models/MusicAcademy')
const RazorpayCred = require("../razorpay-initial")
const RazorPayOrder = require("../models/Supbscription")
const Musicaddres = require("../models/MusicAcademy")
const Receipt = require("./PaymentRequestC")
const SubScriptionPayment = require("../models/SubscriptionPayment")
const { socketIOSingleton } = require("../socket-factory")
const SendingCredentials = require("../controllers/SendingCredentials")
const { redis } = require("../RedisInitalitation")
const subscriptionreminder = require("./SubscriptionReminder")

function formatAddress(data) {
    return `${data.academy_address}, ${data.academy_city}, ${data.academy_state} - ${data.academy_pincode}`;
}

function generateRandomPassword() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function extractYear(dateString) {
    // Check if the date string is in the correct format
    if (!/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
        throw new Error("Invalid date format. Expected format: dd-mm-yyyy");
    }

    // Split the date string and return the year
    const parts = dateString.split("-");
    return parts[2];
}


function getOneYearLaterDate(newdate) {
    const [day, month, year] = newdate.split('-').map(Number);
    const parsedDate = new Date(year, month - 1, day);
    parsedDate.setFullYear(parsedDate.getFullYear() + 1);
    const resultDay = String(parsedDate.getDate()).padStart(2, '0');
    const resultMonth = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const resultYear = parsedDate.getFullYear();

    return `${resultDay}-${resultMonth}-${resultYear}`;
}


function getTodayDate() {
    const today = new Date();

    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
}

function getDateAfterDays(days) {
    const today = new Date();
    today.setDate(today.getDate() + days);

    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
}

// Academy Signup Controller
const academy_signup = async (req, res) => {
    try {
        const { academy_name, academy_email } = req.body;

        // Check if the academy is already registered
        const existingUser = await Admin.findOne({ academy_email });
        if (existingUser) {
            return res.status(409).json({ error: 'Academy is already registered' });
        }

        // Prevent conflict with existing academy names
        let resolvedAcademyName = academy_name;
        const existingNameConflict = await preventconflict(academy_name);

        if (existingNameConflict) {
            let isConflict = true;

            while (isConflict) {
                const randomSuffix = generateRandomThreeDigitNumber();
                resolvedAcademyName = `${academy_name}${randomSuffix}`;
                isConflict = await preventconflict(resolvedAcademyName);
            }
        }

        // Fetch basic details from MusicAcademy after resolving name conflict
        const basicDetails = await MusicAcademy.findOne({ academy_name: resolvedAcademyName });

        let id = ""
        if (basicDetails) {
            id = basicDetails._id
        } else {
            id = "";
        }

        // Create a new admin entry
        const newUser = new Admin({
            academy_name: resolvedAcademyName,
            academy_email,
            academy_id: id
        });

        const user = await newUser.save();

        // adding data to redis  

        const hashkey = "subscriptions"

        await subscriptionreminder.calculateSubscriptionReminder(user, hashkey)

        res.status(200).json(user);

    } catch (error) {
        console.error('Error in academy_signup:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Academy Login Controller
const academy_login = async (req, res) => {
    const { academy_email, academy_password, academy_username } = req.body;
    const user = await Admin.findOne({ academy_email });

    if (user) {
        const validPassword = await bcrypt.compare(academy_password, user.academy_password);
        if (validPassword && (academy_username === user.academy_username)) {
            const accesstoken = jwt.sign(user.toJSON(), process.env.SECRET_KEY, { expiresIn: '16h' });
            const refreshtoken = jwt.sign(user.toJSON(), process.env.REFRESH_KEY);
            const newToken = new Token({ token: refreshtoken });
            await newToken.save();

            const acdemydetails = await MusicAcademy.findOne({ _id: user.academy_id });
            const academycity = acdemydetails.academy_city;
            const academyid = user.academy_id;

            return res.status(200).json({ accesstoken, academyname: user.academy_name, refreshtoken, status: user.academy_access, academyid: user.academy_id, city: academycity, academyid: academyid });
        } else {
            res.status(404).json({ message: "Invalid Credentials" });
        }
    } else {
        return res.status(404).json({ message: "User Not Found" });
    }
};

// get details of the academy by name 

const academybyname = async (req, res) => {
    const { academy_name } = req.body;
    const response = await Admin.find({ academy_name: academy_name });

    if (response) {
        res.status(200).json(response);
    }
    else {
        res.status(404).json({ msg: 'No user found ' })
    }
}

// random 3 digit genearator  

function generateRandomThreeDigitNumber() {
    return Math.floor(Math.random() * 900) + 100;
}

// function to check the academy name exists for conflict prevent 

const preventconflict = async (academyname) => {
    const existingacademy = await Admin.findOne({ academy_name: academyname })
    if (existingacademy) {
        return true
    } else {
        return false
    }

}


// payment options setup in academy reg form  - razorpay 

const handlepaymentaddition = async (req, res) => {
    try {

        const { paymentoption, amount, adminid } = req.body;

        const response = await Admin.findOne({ academy_id: adminid })

        if (response) {

            if (paymentoption === "Pay Now") {

                // create razorpay order 
                // make payment  

                if (!amount || !adminid) {
                    return res.status(400).json({
                        success: false,
                        error: 'Amount and admin ID are required'
                    });
                }

                const razorpayInstance = await RazorpayCred.superadminrazorpaycred();


                const options = {
                    amount: amount * 100,
                    currency: 'INR',
                    receipt: `receipt_${Date.now()}`,
                };

                const order = await razorpayInstance.orders.create(options);

                // saving order details in db 
                const newOrder = new RazorPayOrder({
                    academyname: response.academy_name,
                    razorpayOrderId: order.id,
                    adminId: adminid,
                    amount: order.amount,
                    status: 'created',
                });

                const data = await newOrder.save();

                res.status(201).json(data);

            } else {
                response.paymentstatus === "Pay Later"
                await response.save()

                return res.status(200).json({ msg: "You Request is Accepted 🎉 " })
            }
        } else {
            return res.status(404).json({ msg: "No academy found " })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

const handlemanualsubscriptionpayment = async (req, res) => {
    try {

        const { academyname, role, adminid, paymentmode, paymentdate, amount } = req.body

        if (role === "Superadmin") {

            const currentyear = extractYear(paymentdate)

            const existingInfo = await Admin.findOne({
                academy_id: adminid,
                academy_name: academyname
            })

            if (existingInfo && existingInfo.renewaldate !== "N/A") {
                const renewaldate = existingInfo.renewaldate
                const renewalyear = extractYear(renewaldate)

                if (renewalyear !== currentyear
                ) {
                    return res.status(400).json({ msg: "The Renewal Year and Payment Date Conflicts " })
                }

                const nextpaymentdate = getOneYearLaterDate(renewaldate)

                const newentry = SubScriptionPayment({
                    academyname: academyname,
                    adminId: adminid,
                    paymentdate: paymentdate,
                    nextpaymentdate: nextpaymentdate,
                    paymentmode: paymentmode,
                    amount: amount
                })

                await newentry.save()

                // update stats  

                existingInfo.renewaldate = nextpaymentdate

                existingInfo.paymentstatus =
                    "Paid"


                // update password and username  

                existingInfo.academy_password = generateRandomPassword()
                existingInfo.academy_username = existingInfo.academy_name


                // send credentials mail 
                await SendingCredentials.sendautocred(existingInfo.academy_email, existingInfo.academy_username, existingInfo.academy_password)

                const salt = await bcrypt.genSalt();
                const hashedpwd = await bcrypt.hash(existingInfo.academy_password, salt);

                existingInfo.academy_password = hashedpwd


                existingInfo.academy_url = `https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/${existingInfo.academy_name}`

                await existingInfo.save()

                // change details in redis 

                const hkey = "subscriptions"

                await subscriptionreminder.updateAcademyDetails(existingInfo.academy_id, existingInfo.renewaldate, hkey)

                // send mail 

                const address = await Musicaddres.findOne({ _id: adminid })

                const formatedAddress = formatAddress(address)

                const receiptno = Receipt.generateReceiptNumber()


                await Email.sendsubscriptioninvoice(existingInfo.academy_email, `${existingInfo.academy_name} - Music Academy `, formatedAddress, receiptno, paymentdate, existingInfo.renewaldate, "Advance", "3,280", "720", "4,000")

                return res.status(200).json({ msg: "Payment Added" })

            }
            else {

                const nextpaymentdate = getOneYearLaterDate(paymentdate)

                const newentry = SubScriptionPayment({
                    academyname: academyname,
                    adminId: adminid,
                    paymentdate: paymentdate,
                    nextpaymentdate: nextpaymentdate,
                    paymentmode: paymentmode,
                    amount: amount
                })

                await newentry.save()

                // update stats  

                existingInfo.renewaldate = nextpaymentdate

                await existingInfo.save()


                // change details in redis 

                const hkey = "subscriptions"

                await subscriptionreminder.updateAcademyDetails(existingInfo.academy_id, existingInfo.renewaldate, hkey)

                // send mail 

                const address = await Musicaddres.findOne({ _id: adminid })

                const formatedAddress = formatAddress(address)

                const receiptno = Receipt.generateReceiptNumber()


                await Email.sendsubscriptioninvoice(existingInfo.academy_email, `${existingInfo.academy_name} - Music Academy `, formatedAddress, receiptno, paymentdate, existingInfo.renewaldate, "Advance", "3,280", "720", "4,000")

                return res.status(200).json({ msg: "Payment Added" })
            }

        } else {
            return res.status(401).json({ msg: "Unautorized Access" })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });

    }
}


const verifysubscriptionpayment = async (req, res) => {
    try {

        const { verificationData } = req.body


        const order = await RazorPayOrder.findOne({
            adminId: verificationData.adminId,
            razorpayOrderId: verificationData.orderId
        })

        if (order) {
            order.status = "Completed"
            const update = await order.save()
            const adminprofile = await Admin.findOne({ academy_id: verificationData.adminId })

            adminprofile.paymentstatus = "Paid"
            adminprofile.academy_access = "Accept"

            // update password and username  

            adminprofile.academy_password = generateRandomPassword()
            adminprofile.academy_username = adminprofile.academy_name


            // send credentials mail 
            await SendingCredentials.sendautocred(adminprofile.academy_email, adminprofile.academy_username, adminprofile.academy_password)

            const salt = await bcrypt.genSalt();
            const hashedpwd = await bcrypt.hash(adminprofile.academy_password, salt);

            adminprofile.academy_password = hashedpwd


            adminprofile.academy_url = `https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/${adminprofile.academy_name}`

            if (adminprofile.renewaldate === "N/A") {
                const currentDate = getTodayDate()
                adminprofile.renewaldate = getOneYearLaterDate(currentDate)
            } else {
                const currentDate = adminprofile.renewaldate
                adminprofile.renewaldate = getOneYearLaterDate(currentDate)
            }

            // mail for invoice   

            // academy address  

            const address = await Musicaddres.findOne({ _id: adminprofile.academy_id })

            const formatedAddress = formatAddress(address)

            const receiptno = Receipt.generateReceiptNumber()

            const paymentdate = getTodayDate()

            await Email.sendsubscriptioninvoice(adminprofile.academy_email, `${adminprofile.academy_name} - Music Academy `, formatedAddress, receiptno, paymentdate, adminprofile.renewaldate, "Advance", "3,280", "720", "4,000")

            await adminprofile.save()

            // change details in redis 

            const hkey = "subscriptions"

            await subscriptionreminder.updateAcademyDetails(adminprofile.academy_id, adminprofile.renewaldate, hkey)


            // inserting payment order  
            const newentry = new SubScriptionPayment({
                academyname: adminprofile.academy_name,
                adminId: adminprofile.academy_id,
                paymentdate: paymentdate,
                nextpaymentdate: getOneYearLaterDate(paymentdate),
                paymentmode: "Razorpay",
                amount: 4000
            })

            await newentry.save()

            // deleting order  

            await RazorPayOrder.findOneAndDelete({ adminId: adminprofile.academy_id, razorpayOrderId: update.razorpayOrderId })

            return res.status(200).json({ msg: "Thank you for your payment 🤝 " })
        } else {
            return res.status(404).json({ msg: "Order Not Found " })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}


const rejectpayment = async (req, res) => {
    try {

        const { orderId, adminid, academyname } = req.body

        const Order = await RazorPayOrder.findOne({
            academyname: academyname,
            adminId: adminid,
            razorpayOrderId: orderId
        })

        if (Order) {

            // payment fail msg 

            // await Email.paymentfailed(academyname, email, paymentdate, amount)

            await Order.deleteOne()

            return res.status(200).json({ msg: "Mail Send and Order Deleted " })

        } else {
            return res.status(404).json({ msg: "Order Not Found" })
        }

    } catch (error) {
        console.error("Error verifying Razorpay order:", error);
        res.status(500).json({ success: false, error: 'Failed to veify Razorpay order', error });
    }
}

const getinstallmentlist = async (req, res) => {
    try {

        const { role, academyname, adminid } = req.body

        if (role === "Superadmin") {

            const entrys = await SubScriptionPayment.find({
                adminId: adminid,
                academyname: academyname
            })
            return res.status(200).json(entrys)
        } else {
            return res.status(401).json({ msg: "Unauthorized Access" })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });

    }
}

const freetrialrequest = async (req, res) => {
    try {

        const { academyname } = req.body

        const existingInfo = await Admin.findOne({ academy_name: academyname })

        if (existingInfo) {

            existingInfo.paymentstatus = "Free Trial"
            const sevenDaysLater = getDateAfterDays(7);

            existingInfo.renewaldate = sevenDaysLater
            socketIOSingleton.emit('newFreeTrialReq', existingInfo);
            await existingInfo.save()


            // change details in redis 

            const hkey = "subscriptions"

            await subscriptionreminder.updateAcademyDetails(existingInfo.academy_id, existingInfo.renewaldate, hkey)


            return res.status(200).json({ msg: "Request Submitted . " })

        } else {
            return res.status(404).json({ msg: "Details Not Found " })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

// get free trial academy list 

const fetchfreelist = async (req, res) => {
    try {

        const { role } = req.body

        if (role === "Superadmin") {
            const academylist = await Admin.find({ paymentstatus: "Free Trial" })

            const detailedList = await Promise.all(
                academylist.map(async (academy) => {
                    const musicAcademyDetails = await MusicAcademy.findOne({ academy_name: academy.academy_name });

                    return {
                        accessDetails: academy,
                        musicAcademyDetails: musicAcademyDetails || {},
                    };
                })
            );

            return res.status(200).json(detailedList)
        } else {
            return res.status(401).json({ msg: "Unauthorized Access" })
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

// submit free trial request  

const handlesubmitfreetrial = async (req, res) => {

    try {

        const { academyid, role, status } = req.body

        if (role === "Superadmin") {

            const existing = await Admin.findOne({ academy_id: academyid })
            if (existing) {

                if (status === "Reject") {
                    existing.academy_access = "Reject"
                    return res.status(200).json({ msg: "Request Rejected . " })
                }

                existing.academy_access = "Accept"
                const address = await Musicaddres.findOne({ _id: existing.academy_id })
                const formatedAddress = formatAddress(address)
                const receiptno = Receipt.generateReceiptNumber()

                // update password and username  

                existing.academy_password = generateRandomPassword()
                existing.academy_username = existing.academy_name


                // send credentials mail 
                await SendingCredentials.sendautocred(existing.academy_email, existing.academy_username, existing.academy_password)

                const salt = await bcrypt.genSalt();
                const hashedpwd = await bcrypt.hash(existing.academy_password, salt);

                existing.academy_password = hashedpwd

                const sevenDaysLater = getDateAfterDays(7);

                existing.renewaldate = sevenDaysLater

                existing.academy_url = `https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/${existing.academy_name}`

                await existing.save()


                // change details in redis 

                const hkey = "subscriptions"

                await subscriptionreminder.updateAcademyDetails(existing.academy_id, existing.renewaldate, hkey)


                // send invoice mail 
                await Email.sendsubscriptioninvoice(existing.academy_email, `${existing.academy_name} - Music Academy `, formatedAddress, receiptno, "N/A", existing.renewaldate, "Free Trial", "0", "0", "0")

                return res.status(200).json({ msg: "Request Accepted  . " })
            } else {
                return res.status(404).json({ msg: "Academy Not Found " })
            }

        } else {
            return res.status(401).json({ msg: "Unauthorized Access" })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }


}

module.exports = {
    academy_login,
    academy_signup,
    academybyname,
    handlepaymentaddition,
    verifysubscriptionpayment,
    rejectpayment,
    handlemanualsubscriptionpayment,
    getinstallmentlist,
    freetrialrequest,
    fetchfreelist,
    handlesubmitfreetrial,
    getTodayDate,
    formatAddress
}; 