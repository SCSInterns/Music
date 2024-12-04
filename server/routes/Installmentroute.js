const express = require('express');
const router = express.Router();
const authenticate = require('../controllers/Authenticate')
const Installment = require('../controllers/Installmentcontroller')
const Payment = require('../controllers/PaymentDuec')
const PaymentRequest = require("../controllers/PaymentRequestC")
const RazorPayOrder = require("../controllers/RazorPayPayment")

router.post('/addpaymentdetails/:studentId', authenticate.authenticatetoken, Installment.handlenextinstallmentdate)
router.post('/getinfoinstallment', authenticate.authenticatetoken, Installment.getinfoofinstallment)
router.post('/getpaymnetdue', authenticate.authenticatetoken, Installment.getinfoofpendingpayments)
router.post('/paymentreminder', authenticate.authenticatetoken, Payment.calculatePaymentDueDates)
router.put('/addlatestdue', authenticate.authenticatetoken, Installment.handlelatestpaymnetdue)
router.post('/getsubscriptiondetails', authenticate.authenticatetoken, Installment.getUserSubscriptionDetails)
router.post('/getpaymentstats', authenticate.authenticatetoken, Installment.getpaymentstats)
router.post('/submitmanualpayment', authenticate.authenticatetoken, PaymentRequest.handlenewrequest)
router.post('/verifymanualpayment', authenticate.authenticatetoken, PaymentRequest.handlestatusofpayment)
router.post('/getnewpaymentrequest', authenticate.authenticatetoken, PaymentRequest.fetchnewrequest)
router.post('/createrazorpayorder', authenticate.authenticatetoken, RazorPayOrder.createOrder)
router.post('/verifyrazorpayorder', authenticate.authenticatetoken, RazorPayOrder.verifypayment)
router.post('/failedpayment', authenticate.authenticatetoken, RazorPayOrder.rejectpayment)

module.exports = router