const Advertise = require("../models/AdvertisePricing")
const RegisterAdvertise = require("../models/AdvertiseApplication")
const Academy = require("../models/MusicAcademy")
const Academysignup = require("./AcademySignupc")
const CityAdvertise = require("../models/AdvertiseCityCount")
const Emailc = require("./emailc")
const MusicAcademy = require("../models/MusicAcademy")
const Admin = require("../models/Admin")
const { generateReceiptNumber } = require("./PaymentRequestC")
const RazorPayCred = require("../models/RazorPayCred")
const { superadminrazorpaycred } = require("../razorpay-initial")
const RazorPayOrder = require("../models/Supbscription")
const cron = require('node-cron');
const { socketIOSingleton } = require("../socket-factory")

cron.schedule("0 0 * * *", () => {
    try {
        resetlmit()
    } catch (error) {
        console.log("Error connceting to cron", error)
    }
}
)

const resetlmit = async () => {

    const Advertise = await RegisterAdvertise.find({})
    const todayDate = Academysignup.getTodayDate()

    for (const adv of Advertise) {
        if (adv.expirydate === todayDate) {
            const city = adv.academycity
            const id = adv.advertiseid

            console.log(adv)
            const count = await CityAdvertise.findOne({ advertiseId: id, city: city })
            count.count = count.count - 1
            await count.save()
            console.log(count)
            return
        }
    }


}


const newEntry = async (req, res) => {

    try {

        const { role, name, price, limit, section, features } = req.body

        if (role === "Superadmin") {

            const newEntry = new Advertise({
                name: name,
                price: price,
                limit: limit,
                section: section,
                features: features
            })

            const response = await newEntry.save()
            socketIOSingleton.emit('NewAdvertisePlan', response);
            if (response) {
                return res.status(201).json({ message: "Advertise Pricing Created Successfully" })
            } else {
                return res.status(500).json({ message: "Internal Server Error" })
            }

        } else {
            return res.status(401).json({ message: "Unauthorized Access" })
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }

}

const updateEntry = async (req, res) => {
    try {


        const { role, name, price, limit, features, id, section } = req.body

        if (role === "Superadmin") {

            const existing = await Advertise.findOne({ _id: id })

            if (existing) {
                existing.name = name
                existing.price = price
                existing.limit = limit
                existing.section = section
                existing.features = features

                const response = await existing.save()

                if (response) {
                    socketIOSingleton.emit('NewAdvertisePlan', response);
                    return res.status(200).json({ message: "Advertise Pricing Updated Successfully" })
                } else {
                    return res.status(500).json({ message: "Internal Server Error " })
                }

            } else {
                return res.status(404).json({ message: "Not Found" })
            }

        } else {
            return res.status(401).json({ message: "Unauthorized Access" })
        }


    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }
}

const deleteEntry = async (req, res) => {
    try {

        const { id, role } = req.body

        if (role === "Superadmin") {

            const entry = await Advertise.findOne({ _id: id })

            if (entry) {

                const response = await Advertise.deleteOne({ _id: id })

                if (response) {
                    socketIOSingleton.emit('NewAdvertisePlan', response);
                    return res.status(200).json({ message: "Advertise Pricing Deleted Successfully" })
                } else {
                    return res.status(500).json({ message: "Internal Server Error" })
                }

            } else {
                return res.status(404).json({ message: "Not Found" })
            }

        } else {
            return res.status(401).json({ message: "Unauthorized Access" })
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }
}

const allentries = async (req, res) => {

    try {

        const entries = await Advertise.find({});
        const cityCounts = await CityAdvertise.find({});

        if (entries) {
            const response = entries.map((entry) => {
                const relatedCounts = cityCounts.filter(
                    (count) => count.advertiseId.toString() === entry._id.toString()
                );
                return {
                    ...entry._doc,
                    cityCounts: relatedCounts.map((count) => ({
                        city: count.city,
                        count: count.count,
                    })),
                };
            });

            return res.status(200).json(response);
        } else {
            return res.status(404).json({ message: "Not Found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })

    }
}

// city count mng  
async function updateCityAdvertiseCount(advertiseId, cityName) {
    try {
        const cityAdvertise = await CityAdvertise.findOne({ advertiseId, city: cityName });

        if (cityAdvertise) {
            cityAdvertise.count += 1;
            await cityAdvertise.save();
        } else {
            await CityAdvertise.create({ advertiseId, city: cityName, count: 1 });
        }
        return
    } catch (error) {
        console.error('Error updating city advertisement count:', error);
    }
}

// register for advertise
const allocateadvertise = async (role, academyid, amount, advertiseid, advertisename, bannerlink, section) => {
    try {
        if (role === "Admin") {
            const Academydetails = await Academy.findOne({ _id: academyid });
            const Admind = await Admin.findOne({ academy_id: academyid });

            if (!Academydetails) {
                return;
            }
            if (!Admind) {
                return;
            }

            await updateCityAdvertiseCount(advertiseid, Academydetails.academy_city);

            const todaydate = Academysignup.getTodayDate();

            const newapplication = new RegisterAdvertise({
                academyid: academyid,
                academyname: Academydetails.academy_name,
                academycity: Academydetails.academy_city,
                amount: amount,
                advertiseid: advertiseid,
                advertisename: advertisename,
                paymentstatus: "Pending",
                bannerlink: bannerlink,
                websitelink: Admind.academy_url,
                date: todaydate,
                section: section,
                paymentdate: "Pending",
                paymentmode: "Pending",
            });

            try {
                const response = await newapplication.save();
                return response;
            } catch (error) {
                console.error("Error while saving the application:", error);
            }
        } else {
            return;
        }
    } catch (error) {
        console.error("Error in allocateadvertise:", error);
    }
};


// handle payment - paylater
const handleadvertisepayment = async (req, res) => {

    try {

        const { role, academyid, advertiseid, academycity, amount, advertisename, section } = req.body

        if (role !== "Admin") {
            return res.status(401).json({ message: "Unauthorized Access" })
        }

        const response = await allocateadvertise(role, academyid, amount, advertiseid, advertisename, "pending", section)

        // instant update to superadmin 
        socketIOSingleton.emit('NewApplicationAdv', response);

        return res.status(200).json({ message: "Allocation Successfull" })


    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }


}

// get academy advertise plans  

const getadvertiseplans = async (req, res) => {
    try {

        const { role, academyid } = req.body

        if (role !== "Admin") {
            return res.status(401).json({ message: "Unauthorized Access" })
        }

        const advertiseplans = await RegisterAdvertise.find({ academyid: academyid });
        if (advertiseplans) {
            return res.status(200).json(advertiseplans)
        } else {
            return res.status(404).json({ message: "Not Found" })
        }


    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }

}

// get all entries for advertise application 

const getalladvertiseapplications = async (req, res) => {
    try {

        const { role } = req.body

        if (role !== "Superadmin") {
            return res.status(401).json({ message: "Unauthorized Access" })
        }

        const advertiseapplications = await RegisterAdvertise.find({});
        if (advertiseapplications) {
            return res.status(200).json(advertiseapplications)
        } else {
            return res.status(404).json({ message: "Not Found" })
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }

}

// 30 days later payment date  

function calculateDateAfter30Days(inputDate) {
    const [day, month, year] = inputDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + 30);
    const newDay = String(date.getDate()).padStart(2, "0");
    const newMonth = String(date.getMonth() + 1).padStart(2, "0");
    const newYear = date.getFullYear();
    return `${newDay}-${newMonth}-${newYear}`;
}

// handle payment addition 

const addadvrpayment = async (req, res) => {
    try {

        const { role, id, paymentmode, paymentdate } = req.body

        if (role !== "Superadmin") {
            return res.status(401).json({ message: "Unauthorized Access" })
        }

        const advertiseapplication = await RegisterAdvertise.findOne({ _id: id });

        if (advertiseapplication) {
            const expirydate = calculateDateAfter30Days(paymentdate);

            advertiseapplication.paymentdate = paymentdate
            advertiseapplication.paymentmode = paymentmode
            advertiseapplication.expirydate = expirydate
            advertiseapplication.paymentstatus = "Paid"
            await advertiseapplication.save();

            const Address = await MusicAcademy.findOne({ _id: advertiseapplication.academyid })

            const formatAddress = await Academysignup.formatAddress(Address)

            const admin = await Admin.findOne({ academy_id: advertiseapplication.academyid })

            const recieptno = generateReceiptNumber()

            // send email invoice    
            const amount = Math.floor(advertiseapplication.amount * (1 - 0.18));
            const gst = Math.floor(advertiseapplication.amount * 0.18);
            const totalamount = advertiseapplication.amount;


            const mail = await Emailc.sendsubscriptioninvoice(admin.academy_email, admin.academy_name, formatAddress, recieptno, paymentdate, expirydate, "Advertise", amount, gst, totalamount)
            return res.status(200).json({ message: "Payment Added Successfully" })
        } else {
            return res.status(404).json({ message: "Not Found" })
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }

}

// compare dates for expiry 
const compareDates = (date1, date2) => {
    const [day1, month1, year1] = date1.split("-").map(Number);
    const [day2, month2, year2] = date2.split("-").map(Number);

    // Create Date objects
    const d1 = new Date(year1, month1 - 1, day1);
    const d2 = new Date(year2, month2 - 1, day2);

    // Compare the dates
    if (d2 >= d1) {
        return true;
    }
    else {
        return false;
    }
};

// get adv acc to city 

const getadvaccbycity = async (req, res) => {
    try {
        const { city } = req.body
        const currentdate = Academysignup.getTodayDate();
        const advertiseapplications = await RegisterAdvertise.find({ academycity: city, paymentstatus: "Paid", section: "Banner" });

        const filteredadv = []
        for (adv of advertiseapplications) {
            const result = compareDates(currentdate, adv.expirydate)
            if (result === true) {
                if (adv.bannerlink !== "pending") {
                    filteredadv.push(adv)
                }
            }
        }
        if (advertiseapplications) {

            return res.status(200).json(filteredadv)
        } else {
            return res.status(404).json({ message: "Not Found" })
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }

}

// create razorpay order for advertise 
const createrazorpayorderadvertise = async (req, res) => {
    try {

        const { amount, advertiseid, academyname } = req.body

        if (!amount || !advertiseid) {
            return res.status(400).json({
                success: false,
                error: 'Amount and advertise ID are required'
            });
        }

        const razorpayInstance = await superadminrazorpaycred();
        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        // saving order details in db 
        const newOrder = new RazorPayOrder({
            academyname: academyname,
            razorpayOrderId: order.id,
            adminId: advertiseid,
            amount: order.amount,
            status: 'created',
        });

        const data = await newOrder.save();

        res.status(201).json(data);

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }
}

// verify razorpay order for advertise 
const verifyrazorpayorderadvertise = async (req, res) => {
    try {

        const { verificationData } = req.body


        const order = await RazorPayOrder.findOne({
            adminId: verificationData.advertiseid,
            razorpayOrderId: verificationData.orderId
        })

        if (order) {
            order.status = "Completed"
            const update = await order.save()

            var amount = Math.floor(order.amount / 100)

            const defaultadv = await allocateadvertise("Admin", verificationData.academyid, amount, verificationData.advertiseid, verificationData.advertisename, "pending", verificationData.section)

            defaultadv.paymentstatus = "Paid"
            defaultadv.paymentmode = "Razorpay"

            const paymentdate = Academysignup.getTodayDate()
            const expirydate = calculateDateAfter30Days(paymentdate)

            defaultadv.paymentdate = paymentdate
            defaultadv.expirydate = expirydate
            await defaultadv.save()

            const Address = await MusicAcademy.findOne({ _id: defaultadv.academyid })

            const formatAddress = await Academysignup.formatAddress(Address)

            const admin = await Admin.findOne({ academy_id: defaultadv.academyid })
            const recieptno = generateReceiptNumber()

            // send email invoice    
            amount = Math.floor(defaultadv.amount * (1 - 0.18));
            const gst = Math.floor(defaultadv.amount * 0.18);
            const totalamount = defaultadv.amount;


            const mail = await Emailc.sendsubscriptioninvoice(admin.academy_email, admin.academy_name, formatAddress, recieptno, paymentdate, expirydate, "Advertise", amount, gst, totalamount)

            await RazorPayOrder.findOneAndDelete({ adminId: order.adminId, razorpayOrderId: order.razorpayOrderId })

            // instant update to superadmin 

            socketIOSingleton.emit('NewApplicationAdv', defaultadv);

            return res.status(200).json({ message: "Payment Added Successfully" })
        } else {
            return res.status(404).json({ message: "Not Found" })
        }



    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }

}


// failed razorpay payment 
const failedrazorpaypayment = async (req, res) => {
    try {
        const { orderId, adminid, academyname } = req.body

        const Order = await RazorPayOrder.findOne({
            academyname: academyname,
            adminId: adminid,
            razorpayOrderId: orderId
        })

        const advertise = await RegisterAdvertise.findOne({ _id: adminid })

        const acdemydetails = await Admin.findOne({ academy_id: advertise.academyid })

        const paymentdate = Academysignup.getTodayDate()

        if (Order) {
            // payment fail msg 
            await Emailc.paymentfailed(academyname, acdemydetails.academy_email, paymentdate, Order.amount)

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

module.exports = { newEntry, updateEntry, deleteEntry, allentries, allocateadvertise, handleadvertisepayment, getadvertiseplans, getalladvertiseapplications, addadvrpayment, getadvaccbycity, createrazorpayorderadvertise, verifyrazorpayorderadvertise, failedrazorpaypayment }