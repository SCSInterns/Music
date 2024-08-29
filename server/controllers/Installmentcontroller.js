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
        const { academyname, course, amount, role, studentname, enrollmentDate, paymentmode } = req.body
    
    
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
                paymentmode: paymentmode
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

module.exports = { handlenextinstallmentdate }