const Advertise = require("../models/AdvertisePricing")
const RegisterAdvertise = require("../models/AdvertiseApplication")
const Academy = require("../models/MusicAcademy")
const Academysignup = require("./AcademySignupc")
const Admin = require("../models/Admin")
const CityAdvertise = require("../models/AdvertiseCityCount")

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

        const { role, academyid, advertiseid, academycity, amount, advertisename } = req.body

        if (role !== "Admin") {
            return res.status(401).json({ message: "Unauthorized Access" })
        }

        await allocateadvertise(role, academyid, amount, advertiseid, advertisename, "pending", "pending")

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

            return res.status(200).json({ message: "Payment Added Successfully" })
        } else {
            return res.status(404).json({ message: "Not Found" })
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }

}

// get adv acc to city 

const getadvaccbycity = async (req, res) => {
    try {
        const { city } = req.body
        const advertiseapplications = await RegisterAdvertise.find({ academycity: city, paymentstatus: "Paid" });

        if (advertiseapplications) {
            return res.status(200).json(advertiseapplications)
        } else {
            return res.status(404).json({ message: "Not Found" })
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }

}

module.exports = { newEntry, updateEntry, deleteEntry, allentries, allocateadvertise, handleadvertisepayment, getadvertiseplans, getalladvertiseapplications, addadvrpayment, getadvaccbycity }