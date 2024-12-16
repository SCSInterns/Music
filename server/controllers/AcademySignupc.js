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

function formatAddress(data) {
    return `${data.academy_address}, ${data.academy_city}, ${data.academy_state} - ${data.academy_pincode}`;
}



function getOneYearLaterDate() {
    const today = new Date();
    const nextYear = new Date(today);

    nextYear.setFullYear(today.getFullYear() + 1);

    const day = String(nextYear.getDate()).padStart(2, '0');
    const month = String(nextYear.getMonth() + 1).padStart(2, '0');
    const year = nextYear.getFullYear();

    return `${day}-${month}-${year}`;
}

function getTodayDate() {
    const today = new Date();

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
        if (validPassword && (academy_username === user.academy_username) && (user.academy_access === "Accept")) {
            const accesstoken = jwt.sign(user.toJSON(), process.env.SECRET_KEY, { expiresIn: '16h' });
            const refreshtoken = jwt.sign(user.toJSON(), process.env.REFRESH_KEY);
            const newToken = new Token({ token: refreshtoken });
            await newToken.save();
            return res.status(200).json({ accesstoken, academyname: user.academy_name, refreshtoken });
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


// payment options setup in academy reg form 

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

            console.log(adminprofile)

            adminprofile.paymentstatus = "Paid"

            adminprofile.renewaldate = getOneYearLaterDate()

            // mail for invoice   

            // academy address  

            const address = await Musicaddres.findOne({ _id: adminprofile.academy_id })

            const formatedAddress = formatAddress(address)

            const receiptno = Receipt.generateReceiptNumber()

            const paymentdate = getTodayDate()

            await Email.sendsubscriptioninvoice(adminprofile.academy_email, `${adminprofile.academy_name} - Music Academy `, formatedAddress, receiptno, paymentdate, adminprofile.renewaldate)

            await adminprofile.save()

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

module.exports = {
    academy_login,
    academy_signup,
    academybyname,
    handlepaymentaddition,
    verifysubscriptionpayment,
    rejectpayment
};