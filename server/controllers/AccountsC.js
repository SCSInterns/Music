const Student = require('../models/UserForm');
const Account = require('../models/Account');
const Transaction = require("../models/Transcation");
const cron = require('node-cron');

function adjustDate(inputDate) {
    const [day, month, year] = inputDate.split('-').map(Number);
    const adjustedDay = day > 28 ? 28 : day;
    return `${String(adjustedDay).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
}

// create account 
const accountmng = async (studentid, academyname, role) => {
    if (role === "Admin") {

        const exists = await Account.findOne({ studentid: studentid })

        if (exists) {
            return
        }

        const user = await Student.findOne({ _id: studentid })

        const date = user.installmentDate
        const installmentDate = adjustDate(date)

        const newaccount = new Account({
            academyname: academyname,
            studentname: user.additionalFields?.get("Name"),
            batchname: user.batchname,
            studentemail: user.additionalFields?.get("Email"),
            mobileno: user.additionalFields?.get("MobileNo"),
            course: user.additionalFields?.get("Courses"),
            fees: user.additionalFields?.get("Fees"),
            studentid: user._id,
            previousdue: 0,
            currentdue: user.additionalFields?.get("Fees"),
            outstandingamount: user.additionalFields?.get("Fees"),
            installmentdate: installmentDate,
            status: "Pending"
        })

        await newaccount.save()

        return
    } else {
        return
    }
}

// fetch account data  
const fetchaccountlist = async (req, res) => {
    try {

        const { role, academyname } = req.body

        if (role === "Admin") {
            const list = await Account.find({ academyname: academyname })

            if (list && list.length > 0) {
                return res.status(200).json(list);
            } else {
                return res.status(404).json({ message: "No Account Found" });
            }

        } else {
            return res.status(401).json({ message: "Unauthorized Access" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Internak Server Error", error });
    }
}

// add payment 
const addpayment = async (req, res) => {
    const { studentid, role } = req.body

    if (role === "Admin") {
        const account = await Account.findOne({ studentid: studentid })
        if (account) {
            account.previousdue = 0
            account.currentdue = 0
            account.outstandingamount = 0
            account.status = "Paid"

            await account.save()

            return res.status(200).json(account)
        } else {
            return res.status(404).json({ message: "No Account Found" });
        }

    } else {
        return res.status(401).json({ message: "Unauthorized Access" });
    }
}

// cron job to update account status  
// call when installment date is reached  

const paymentstatsupdation = async (studentid) => {
    const student = await Account.findOne({ studentid: studentid })

    const newpreviousdue = student.previousdue + student.currentdue
    const newcurrentdue = student.fees
    newoutstandingamount = newcurrentdue + newpreviousdue

    student.previousdue = newpreviousdue
    student.currentdue = newcurrentdue
    student.outstandingamount = newoutstandingamount
    student.status = "Pending"

    await student.save()

    return

}

// start from here 

module.exports = { accountmng, fetchaccountlist }