const Student = require('../models/UserForm');
const Account = require('../models/Account');
const Transaction = require("../models/Transcation");
const cron = require('node-cron');
const Email = require("./emailc")
const Recieptno = require("./PaymentRequestC")
const moment = require('moment');
const TodayDate = require("./AcademySignupc")

cron.schedule('0 0 * * *', () => {
    console.log('Running cron job for account mng...');
    cronpaymentstats()
});


const extractDay = (dateString) => {
    const date = moment(dateString, 'DD-MM-YYYY');
    return date.date();
};


const cronpaymentstats = async () => {
    const accounts = await Account.find({})
    const today = moment().format('DD-MM-YYYY');
    const day = extractDay(today)
    for (const account of accounts) {
        const getday = extractDay(account.installmentdate)
        if (day === getday) {
            paymentstatsupdation(account._id)
        }
    }
}

function calculateMonthDifference(date1, date2) {
    // Convert dd-mm-yyyy format to Date object
    const [day1, month1, year1] = date1.split('-').map(Number);
    const [day2, month2, year2] = date2.split('-').map(Number);

    // Create Date objects
    const firstDate = new Date(year1, month1 - 1, day1); // JavaScript months are 0-based
    const secondDate = new Date(year2, month2 - 1, day2);

    // Calculate the month difference
    const yearDiff = secondDate.getFullYear() - firstDate.getFullYear();
    const monthDiff = secondDate.getMonth() - firstDate.getMonth();

    // Total month difference
    return yearDiff * 12 + monthDiff + 1;
}

function adjustDate(inputDate) {
    const [day, month, year] = inputDate.split('-').map(Number);
    const adjustedDay = day > 28 ? 28 : day;
    return `${String(adjustedDay).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
}

// const addaccountdetails = async () => {
//     const accounts = await Student.find({})
//     for (const account of accounts) {
//         accountmng(account._id, account.academy_name, "Admin")
//     }
// }

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

// fetch particular account data  
const fetchparticularaccount = async (req, res) => {
    try {

        const { studentid } = req.body
        const list = await Account.find({ studentid: studentid })

        if (list) {
            return res.status(200).json(list);
        } else {
            return res.status(404).json({ message: "No Account Found" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Internak Server Error", error });
    }
}

// add payment 
const addpayment = async (req, res) => {
    const { studentid, role, paymentmode, paymentdate } = req.body

    if (role === "Admin") {
        const account = await Account.findOne({ studentid: studentid })
        const amount = account.outstandingamount
        if (account) {
            account.previousdue = 0
            account.currentdue = 0
            account.outstandingamount = 0
            account.status = "Paid"

            await account.save()

            // create transaction record   

            const transaction = new Transaction({
                academyname: account.academyname,
                studentname: account.studentname,
                batchname: account.batchname,
                studentemail: account.studentemail,
                course: account.course,
                fees: account.fees,
                paymentmode: paymentmode,
                paymentdate: paymentdate,
                studentid: account.studentid,
                transactionamount: amount,
                installmentdate: account.installmentdate
            })
            await transaction.save()

            // send mail to student  

            const recieptno = await Recieptno.generateReceiptNumber()

            const invoiceData = {
                name: account.studentname || "N/A",
                email: account.studentemail || "N/A",
                course: account.course || "N/A",
                receiptNumber: recieptno || "N/A",
                dateOfPayment: transaction.paymentdate || "N/A",
                amount: transaction.transactionamount || 0,
                academyName: account.academyname || "N/A",
                enrollmentDate: account.installmentdate || "N/A",
                paymentMethod: transaction.paymentmode || "N/A",
                paymentTableData: {
                    headers: ["Date", "Particulars", "Payment Mode", "Amount Paid"],
                    rows: [
                        [
                            transaction.paymentdate || "N/A",
                            "Academy Fees",
                            transaction.paymentmode || "N/A",
                            `Rs. ${transaction.transactionamount || 0}`,
                        ],
                    ],
                },
            };

            Email.sendInvoiceEmail(account.studentemail, invoiceData);
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
    const student = await Account.findOne({ _id: studentid })
    // case fees not paid yet
    if (student.outstandingamount >= 0) {
        const newpreviousdue = student.previousdue + student.currentdue
        const newcurrentdue = student.fees
        newoutstandingamount = newcurrentdue + newpreviousdue

        student.previousdue = newpreviousdue
        student.currentdue = newcurrentdue
        student.outstandingamount = newoutstandingamount
        student.status = "Pending"
        await student.save()
        return
    } else {

        const netoutstandingamount = Math.abs(student.outstandingamount)
        // case fees paid already - one month
        if (netoutstandingamount === student.fees) {
            student.previousdue = 0
            student.currentdue = 0
            student.outstandingamount = 0
            student.status = "Paid"
            await student.save()
            return
        }

        // case fees paid already - more than one month 
        const newoutstandingamount = netoutstandingamount - student.fees

        student.previousdue = 0
        student.currentdue = 0
        student.outstandingamount = -(newoutstandingamount)
        student.status = "Paid"
        await student.save()
        return

    }
}

// advance amount payment 
const advanceamount = async (req, res) => {
    try {
        const { studentid, amount, role, paymentdate, paymentmode } = req.body
        if (role === "Admin") {
            const account = await Account.findOne({ studentid: studentid })
            if (account) {
                const newouststanding = account.outstandingamount + amount
                account.outstandingamount = -(newouststanding)
                account.status = "Paid"
                account.currentdue = 0
                account.previousdue = 0
                await account.save()


                // create transaction record   

                const transaction = new Transaction({
                    academyname: account.academyname,
                    studentname: account.studentname,
                    batchname: account.batchname,
                    studentemail: account.studentemail,
                    course: account.course,
                    fees: account.fees,
                    paymentmode: paymentmode,
                    paymentdate: paymentdate,
                    studentid: account.studentid,
                    transactionamount: amount,
                    installmentdate: account.installmentdate
                })
                await transaction.save()

                // send mail to student  

                const recieptno = await Recieptno.generateReceiptNumber()

                const invoiceData = {
                    name: account.studentname || "N/A",
                    email: account.studentemail || "N/A",
                    course: account.course || "N/A",
                    receiptNumber: recieptno || "N/A",
                    dateOfPayment: transaction.paymentdate || "N/A",
                    amount: transaction.transactionamount || 0,
                    academyName: account.academyname || "N/A",
                    enrollmentDate: account.installmentdate || "N/A",
                    paymentMethod: transaction.paymentmode || "N/A",
                    paymentTableData: {
                        headers: ["Date", "Particulars", "Payment Mode", "Amount Paid"],
                        rows: [
                            [
                                transaction.paymentdate || "N/A",
                                "Academy Fees",
                                transaction.paymentmode || "N/A",
                                `Rs. ${transaction.transactionamount || 0}`,
                            ],
                        ],
                    },
                };

                Email.sendInvoiceEmail(account.studentemail, invoiceData);

                return res.status(200).json({ message: "Advance Amount Added" })
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

// fetch transaction data acc to student 

const fetchtransactiondata = async (req, res) => {
    try {
        const { role, studentname, batchname, academyname } = req.body
        if (role === "Admin") {
            const student = await Transaction.find({ studentname: studentname, batchname: batchname, academyname: academyname })

            if (student) {
                return res.status(200).json(student);
            } else {
                return res.status(404).json({ message: "No Transaction Found" });
            }
        } else {
            return res.status(401).json({ message: "Unauthorized Access" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Internak Server Error", error });
    }

}


// get the custom stats amount from account history 

const formatDate = (date) => {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
};

const customstats = async (req, res) => {
    try {

        const { month, year, role, academyname } = req.body

        if (role === "Admin") {

            const startdate = `01-${month}-${year}`
            const enddate = `31-${month}-${year}`

            const Transactions = await Transaction.find({
                paymentdate: {
                    $gte: startdate,
                    $lte: enddate,
                },
                academyname: academyname
            })

            const account = await Account.find({
                installmentdate:
                {
                    $gte: startdate,
                    $lte: enddate
                },
                academyname: academyname
            })

            const countacc = []
            for (const tran of account) {
                const storeddate = formatDate(tran.installmentdate)
                const givendate = formatDate(enddate)
                if (storeddate < givendate) {
                    countacc.push(tran)
                }
            }

            const counttransc = []

            for (const tran of Transactions) {
                const storeddate = formatDate(tran.paymentdate)
                const givendate = formatDate(enddate)
                if (storeddate < givendate) {
                    counttransc.push(tran)

                }
            }

            if (countacc.length == 0 && counttransc.length == 0) {
                return res.status(404).json({ message: "No Transaction Found" });
            }



            let aamount = 0
            for (const acc of countacc) {
                const fees = acc.fees
                aamount = aamount + fees
            }

            let pmount = 0
            for (const acc of counttransc) {
                const fees = acc.transactionamount
                pmount = pmount + fees
            }


            const stats =
            {
                totalincome: aamount,
                totalpaid: pmount,
                totaldue: aamount - pmount
            }
            return res.status(200).json(stats)

        } else {
            return res.status(401).json({ message: "Unauthorized Access" });
        }


    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }
}

// get the def stats amount from account history
const fetchstats = async (req, res) => {
    try {

        const { role, academyname } = req.body

        if (role === "Admin") {
            const account = await Account.find({ academyname: academyname })
            const transaction = await Transaction.find({ academyname: academyname })

            if (transaction.length > 0 && account.length > 0) {
                let totalincome = 0
                let totalpaid = 0

                for (const acc of account) {
                    const todaydate = await TodayDate.getTodayDate()

                    const monthdiff = calculateMonthDifference(acc.installmentdate, todaydate)
                    const totalcollection =
                        monthdiff * acc.fees
                    totalincome = totalincome + totalcollection
                }

                for (const trans of transaction) {
                    totalpaid = totalpaid + trans.transactionamount
                }

                const stats = {
                    totalincome: totalincome,
                    totalpaid: totalpaid,
                    totaldue: totalincome - totalpaid
                }

                return res.status(200).json(stats)

            } else {
                return res.status(404).json({ message: "No Data Found" });
            }

        } else {
            return res.status(401).json({ message: "Unauthorized Access" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }
}

module.exports = { accountmng, fetchaccountlist, addpayment, advanceamount, fetchparticularaccount, fetchtransactiondata, fetchstats, customstats }