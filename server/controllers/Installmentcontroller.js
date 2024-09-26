const Installement = require("../models/Installment")
const Paymnetdue = require("../models/PaymentDues")
const Token = require('../models/Token');

const addMonths = (date, months) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
};

const convertAndAddMonths = (dateStr, monthsToAdd) => {
    const [day, month, year] = dateStr.split('-');
    const dateObj = new Date(year, month - 1, day);
    const newDate = addMonths(dateObj, monthsToAdd);
    const formattedDate = [
        String(newDate.getDate()).padStart(2, '0'),
        String(newDate.getMonth() + 1).padStart(2, '0'),
        newDate.getFullYear()
    ].join('-');

    return formattedDate;
};



const handlenextinstallmentdate = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { academyname, course, amount, role, studentname, enrollmentDate, paymentmode, studentemail } = req.body

        // Helper function to extract month and year from DD-MM-YYYY format
        const extractMonthYear = (dateStr) => {
            const [day, month, year] = dateStr.split('-');
            return { month: parseInt(month), year: parseInt(year) };
        };

        // Fetch the existing payment data from the database
        const existingInstallments = await Installement.find({ studentId: studentId });

        if (existingInstallments.length > 0) {
            const enrollmentDateParts = extractMonthYear(enrollmentDate);

            // Loop through each existing installment and check for a month-year match with enrollmentDate
            for (let installment of existingInstallments) {
                const paymentDateParts = extractMonthYear(installment.enrollmentDate);
                
                if (paymentDateParts.month === enrollmentDateParts.month && paymentDateParts.year === enrollmentDateParts.year) {
                    return res.status(400).json({ msg: "Enrollment date and an existing payment date fall in the same month. Consistency error in monthly installments." });
                }
            }
        }
        
        const dateStr = enrollmentDate;
        const monthsToAdd = 1;
        const nextPaymentDate = convertAndAddMonths(dateStr, monthsToAdd);
        
        if (role === "Admin") {
            const Newuser = await new Installement({
                studentId: studentId,
                academyname: academyname,
                studentname: studentname,
                course: course,
                amount: amount,
                enrollmentDate: enrollmentDate,
                nextPaymentDate: nextPaymentDate,
                paymentmode: paymentmode,
                studentemail: studentemail
            })
            const response = await Newuser.save()

            if (response) {
                res.status(200).json({ msg: "Details added successfully", Newuser })
            }
            else {
                res.status(404).json({ msg: "Error saving data " })
            }
        } else {
            res.status(401).json({ msg: "Unauthorised Access" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server not supported', error });
    }


}

// get the data for installment for dashboard acc to customer name 

const getinfoofinstallment = async (req, res) => {
    try {
        const { academyname, role, username, studentid } = req.body

        const response = await Installement.find({ studentId: studentid, studentname: username, academyname: academyname })

        if (response) {
            if (role === "Admin") {
                res.status(200).json(response)
            }
            else {
                res.status(401).json({ msg: "Unauthorized Access" })
            }
        }
        else {
            res.status(404).json({ msg: "No Data Found " })
        }
    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }
}

// get all the candinates with current date and next payment date same for cron job 

const getinfoofpendingpayments = async (req, res) => {
    const { academyname, role, currentdate } = req.body

    const Users = await Paymnetdue.find({ nextpaymentdate: currentdate, academyname: academyname })

    if (Users) {
        if (role === "Admin") {
            res.status(200).json(Users)
        }
        else {
            res.status(401).json({ msg: "Unauthorized Access" })
        }
    }
    else {
        res.status(404).json({ msg: "No users found " })
    }

}


const handlelatestpaymnetdue = async (req, res) => {
    try {
        const { paymentdate, academyname, studentname, role, studentid, course, amount, paymentmode, studentemail } = req.body

        if (role === "Admin") {
            const response = await Paymnetdue.findOne({
                studentid: studentid,
                studentname: studentname,
                academyname: academyname
            })

            const dateStr = paymentdate;
            const monthsToAdd = 1;

            const nextpaymentdate = convertAndAddMonths(dateStr, monthsToAdd);

            if (response) {

                const updateduser = {
                    ...req.body,
                    paymentdate: paymentdate,
                    nextpaymentdate: nextpaymentdate
                };

                const updatedinfo = await Paymnetdue.findByIdAndUpdate(response._id, { $set: updateduser }, { new: true })

                if (updatedinfo) {
                    res.status(200).json(updatedinfo)
                }
                else {
                    res.status(404).json({ msg: "Error Updating Data" })
                }
            }
            else {
                const newentry = new Paymnetdue({
                    studentid: studentid,
                    studentname: studentname,
                    academyname: academyname,
                    paymentdate: paymentdate,
                    course: course,
                    amount: amount,
                    paymentmode: paymentmode,
                    studentemail: studentemail,
                    nextpaymentdate: nextpaymentdate,

                })

                const data = await newentry.save()

                if (data) {
                    res.status(200).json(data)
                }
            }
        }
        else {
            res.status(401).json({ msg: "Unauthorized Access" })
        }


    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }
}


// getting days left for dashborad 

const getUserSubscriptionDetails = async (req, res) => {
    try {
        const { academyname, role, studentid } = req.body
        if (role === "Admin") {
            const subscriptions = await Paymnetdue.find({ studentid: studentid, academyname: academyname });
            res.status(200).json(subscriptions);
        }
        else {
            res.status(401).json({ msg: "Unauthorized Access" })
        }

    } catch (error) {
        console.error('Error fetching subscription details:', error);
        res.status(500).send('Server error');
    }
};




module.exports = { handlenextinstallmentdate, getinfoofinstallment, getinfoofpendingpayments, handlelatestpaymnetdue, getUserSubscriptionDetails }