const express = require('express');
const router = express.Router();
const authenticate = require('../controllers/Authenticate')
const emailcontroller = require('../controllers/OtpSending')
const credentialscontroller = require('../controllers/SendingCredentials')
const emailsending = require('../controllers/emailc')
const emailc = require("../controllers/emailc")


router.post('/send-otp', emailcontroller.sendotp)
router.post('/send-customotp', emailcontroller.sendcustomotp)
router.post('/verify-otp', emailcontroller.verifyotp)
router.post('/sendcred', credentialscontroller.sendcred)
router.post('/sendpaymentreminder', authenticate.authenticatetoken, emailsending.sendcustomnodi)
router.post('/sendsubsinvoice', emailc.sendsubscriptioninvoice)

module.exports = router;