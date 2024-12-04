const PaymentRequest = require("../models/PaymentRequest")
const Installement = require("../models/Installment")
const Due = require("../models/PaymentDues")
const InstallmentController = require("./Installmentcontroller")
const Handlepaymentstats = require("./Handlepaymentstats")
const Email = require("./emailc")
const { io } = require('../index')

function generateReceiptNumber() {
    const prefix = '#';
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}${randomNumber}`;
}

const handlenewrequest = async (req, res) => {

    try {
        const { studentid, academyname, course, amount, studentname, paymentmode, enrollmentDate, studentemail, paymentDate, TransactionId } = req.body

        const newentry = new PaymentRequest({
            studentId: studentid,
            academyname: academyname,
            studentname: studentname,
            studentemail: studentemail,
            course: course,
            amount: amount,
            enrollmentDate: enrollmentDate,
            paymentDate: paymentDate,
            paymentmode: paymentmode,
            TransactionId: TransactionId

        })

        const savedentry = await newentry.save()

        if (savedentry) {
            io.emit('newPayment', savedentry);
            return res.status(200).json(savedentry)
        }
        else {
            return res.status(404).json({ msg: "Error saving details" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server not supported', error });
    }
}


// handle status change by admin 

const handlestatusofpayment = async (req, res) => {
    try {

        const { role, academyname, studentId, status, paymentdate } = req.body

        if (role === "Admin") {

            const paymententry = await PaymentRequest.findOne({ studentId: studentId, academyname: academyname, paymentDate: paymentdate })
            if (paymententry) {

                const updatedDetails = {
                    ...req.body,
                    status: status
                };

                const updatedPayment = await PaymentRequest.findOneAndUpdate(
                    { studentId: studentId, academyname: academyname, paymentDate: paymentdate },
                    { $set: updatedDetails },
                    { new: true }
                );

                if (updatedPayment) {
                    // logic to add entry in installemnt modal  
                    if (updatedPayment.status === "Accept") {
                        const nextpaymentday = InstallmentController.extractDay(updatedPayment.enrollmentDate)
                        const monthandyear = InstallmentController.extractMonthAndYear(updatedPayment.paymentDate)
                        const newdate = `${nextpaymentday}-${monthandyear}`
                        const dateStr = newdate;
                        const monthsToAdd = 1;
                        const nextPaymentDate = InstallmentController.convertAndAddMonths(dateStr, monthsToAdd);
                        const newinstallmententry = await new Installement({
                            studentId: updatedPayment.studentId,
                            academyname: updatedPayment.academyname,
                            studentname: updatedPayment.studentname,
                            course: updatedPayment.course,
                            amount: updatedPayment.amount,
                            enrollmentDate: updatedPayment.enrollmentDate,
                            nextPaymentDate: nextPaymentDate,
                            paymentDate: updatedPayment.paymentDate,
                            paymentmode: updatedPayment.paymentmode,
                            studentemail: updatedPayment.studentemail
                        })
                        const savedInfo = await newinstallmententry.save()
                        if (savedInfo) {
                            const updateduser = {
                                academyname: savedInfo.academyname,
                                studentname: savedInfo.studentname,
                                studentemail: savedInfo.studentemail,
                                course: savedInfo.course,
                                amount: savedInfo.amount,
                                paymentmode: savedInfo.paymentmode,
                                paymentdate: savedInfo.paymentDate,
                                nextpaymentdate: nextPaymentDate,
                                studentid: savedInfo.studentId,
                                installmentdate: savedInfo.enrollmentDate
                            };

                            const updatedPaymentDue = await
                                Due.findOneAndUpdate({ studentid: savedInfo.studentId }, { $set: updateduser }, { new: true })

                            Handlepaymentstats.totalduemanual(updatedPaymentDue)
                            if (updatedPaymentDue) {

                                // send the mail of invoice  

                                const recieptno = generateReceiptNumber()

                                const invoiceData = {
                                    name: updatedPaymentDue.studentname || "N/A",
                                    email: updatedPaymentDue.studentemail || "N/A",
                                    course: updatedPaymentDue.course || "N/A",
                                    receiptNumber: recieptno || "N/A",
                                    dateOfPayment: updatedPaymentDue.paymentdate || "N/A",
                                    amount: savedInfo.amount || 0,
                                    academyName: updatedPaymentDue.academyname || "N/A",
                                    enrollmentDate: updatedPaymentDue.installmentdate || "N/A",
                                    paymentMethod: "Online (Manual)",
                                    paymentTableData: {
                                        headers: ["Date", "Particulars", "Amount Paid", "NextPaymentDate"],
                                        rows: [
                                            [
                                                savedInfo.paymentDate || "N/A",
                                                "Monthly Fees",
                                                `Rs. ${savedInfo.amount || 0}`,
                                                savedInfo.nextPaymentDate || "N/A",
                                            ],
                                        ],
                                    },
                                };


                                Email.sendInvoiceEmail(updatedPaymentDue.studentemail, invoiceData);

                                // deleting the temp PaymentReq entry 
                                await PaymentRequest.findByIdAndDelete(paymententry._id);

                                return res.status(200).json({ msg: "All Details Updated SuccessFully " })

                            } else {
                                return res.status(404).json({
                                    msg: 'Error Updating Details '
                                })
                            }
                        }
                    } else {

                        // mail template for rejected mail 
                        await Email.paymentfailed(updatedPayment.academyname, updatedPayment.studentemail, updatedPayment.paymentDate, updatedPayment.amount)
                        await PaymentRequest.findByIdAndDelete(paymententry._id);
                        return res.status(200).json({ msg: "Payment Status Updated to Failed" })
                    }
                } else {
                    return res.status(404).json({ msg: "Error Saving Status " })
                }
            } else {
                return res.status(404).json({ msg: "Entry Not Found " })
            }
        } else {
            return res.status(401).json({ msg: "Unauthorized Access" })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }
}

// get the details of new requests 

const fetchnewrequest = async (req, res) => {
    try {

        const { academyname, role } = req.body

        if (role === "Admin") {

            const entries = await PaymentRequest.find({ academyname: academyname })

            if (entries) {
                return res.status(200).json(entries)
            }
            else {
                return res.status(404).json({ msg: "No Entries Found " })
            }

        } else {
            return res.status(401).json({ msg: "Unauthoruzed Access " })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }
}

module.exports = { handlenewrequest, handlestatusofpayment, fetchnewrequest, generateReceiptNumber }