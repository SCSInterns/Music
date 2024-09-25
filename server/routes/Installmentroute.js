const express = require('express');
const router = express.Router();
const authenticate = require('../controllers/Authenticate')
const Installment = require('../controllers/Installmentcontroller')
const Payment = require('../controllers/PaymentDuec')


router.post('/addpaymentdetails/:studentId',authenticate.authenticatetoken,Installment.handlenextinstallmentdate)
router.post('/getinfoinstallment' , authenticate.authenticatetoken , Installment.getinfoofinstallment)
router.post('/getpaymnetdue' , authenticate.authenticatetoken , Installment.getinfoofpendingpayments)
router.post('/paymentreminder',authenticate.authenticatetoken , Payment.calculatePaymentDueDates)
router.put('/addlatestdue',authenticate.authenticatetoken , Installment.handlelatestpaymnetdue)
router.post('/getsubscriptiondetails',authenticate.authenticatetoken , Installment.getUserSubscriptionDetails)

module.exports = router