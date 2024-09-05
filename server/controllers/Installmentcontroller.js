const Installement = require("../models/Installment")
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
        const { academyname, course, amount, role, studentname, enrollmentDate, paymentmode , studentemail} = req.body


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
                paymentmode: paymentmode , 
                studentemail : studentemail
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

    const Users = await Installement.find({ nextPaymentDate: currentdate, academyname: academyname })

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

module.exports = { handlenextinstallmentdate, getinfoofinstallment, getinfoofpendingpayments }