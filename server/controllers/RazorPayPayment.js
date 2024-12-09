const razorpayInstance = require("../razorpay-initial");
const RazorPayOrder = require("../models/RazorPayOrder");
const Due = require("../models/PaymentDues")
const InstallmentController = require("./Installmentcontroller")
const Installement = require("../models/Installment")
const Handlepaymentstats = require("./Handlepaymentstats")
const Email = require("./emailc")
const PaymentRequestC = require("./PaymentRequestC")
const Razorpayintial = require("../razorpay-initial")

// create the order 
const createOrder = async (req, res) => {
    try {
        const { amount, studentid, academyname } = req.body;

        if (!amount || !studentid) {
            return res.status(400).json({
                success: false,
                error: 'Amount and student ID are required'
            });
        }

        const razorpayInstance = await Razorpayintial.getRazorpayInstance(academyname);

        console.log(razorpayInstance)

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
            studentId: studentid,
            amount: order.amount,
            status: 'created',
        });

        const data = await newOrder.save();

        res.status(201).json(data);

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ success: false, error: 'Failed to create Razorpay order' });
    }
};

// verify the order  

const verifypayment = async (req, res) => {
    try {
        const { verificationData } = req.body

        if (verificationData.role === "Admin") {
            const order = await RazorPayOrder.findOne({
                studentId: verificationData.studentId,
                razorpayOrderId: verificationData.orderId
            })

            if (order) {
                order.status = "Completed"
                const update = await order.save()

                if (update.status === "Completed") {

                    // installment entry  

                    const nextpaymentday = InstallmentController.extractDay(verificationData.enrollmentDate)
                    const monthandyear = InstallmentController.extractMonthAndYear(verificationData.paymentDate)
                    const newdate = `${nextpaymentday}-${monthandyear}`
                    const dateStr = newdate;
                    const monthsToAdd = 1;
                    const nextPaymentDate = InstallmentController.convertAndAddMonths(dateStr, monthsToAdd);

                    const newinstallmententry = await new Installement({
                        studentId: verificationData.studentId,
                        academyname: verificationData.academyName,
                        studentname: verificationData.studentName,
                        course: verificationData.course,
                        amount: verificationData.amount,
                        enrollmentDate: verificationData.enrollmentDate,
                        nextPaymentDate: nextPaymentDate,
                        paymentDate: verificationData.paymentDate,
                        paymentmode: "RazorPay",
                        studentemail: verificationData.email
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

                        // updating stats 

                        const updatedPaymentDue = await
                            Due.findOneAndUpdate({ studentid: savedInfo.studentId }, { $set: updateduser }, { new: true })

                        Handlepaymentstats.totalduemanual(updatedPaymentDue)
                        if (updatedPaymentDue) {

                            // send the mail of invoice  

                            const recieptno = PaymentRequestC.generateReceiptNumber()

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

                            // deleting the entry 

                            await RazorPayOrder.findOneAndDelete({ studentId: verificationData.studentId, razorpayOrderId: update.razorpayOrderId })

                            return res.status(200).json({ msg: "All Details Updated SuccessFully " })

                        } else {
                            return res.status(404).json({
                                msg: 'Error Updating Details '
                            })
                        }
                    }

                } else {
                    // deleting order  
                    const deletedorder = await RazorPayOrder.findOneAndDelete({
                        studentId: verificationData.studentId, razorpayOrderId: update.razorpayOrderId
                    })

                    if (deletedorder) {
                        return res.status(200).json({ msg: "Order Deleted Successfully" })
                    } else {
                        return res.status(404).json({ msg: "Order Deletion Failed " })

                    }
                }
            } else {
                return res.status(404).json({ msg: "Order Not Found " })
            }
        } else {
            return res.status(401).json({ msg: "Unauthorized Access" })
        }
    } catch (error) {
        console.error("Error verifying Razorpay order:", error);
        res.status(500).json({ success: false, error: 'Failed to veify Razorpay order', error });
    }
}

const rejectpayment = async (req, res) => {
    try {

        const { studentid, orderid, academyname, email, paymentdate, amount } = req.body

        const Order = await RazorPayOrder.findOne({ studentId: studentid, academyname: academyname, razorpayOrderId: orderid })

        if (Order) {

            await Email.paymentfailed(academyname, email, paymentdate, amount)

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

module.exports = { createOrder, verifypayment, rejectpayment } 