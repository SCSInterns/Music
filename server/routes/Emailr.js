const express = require('express');
const router = express.Router();
const authenticate = require('../controllers/Authenticate')
const emailcontroller = require('../controllers/OtpSending')
const credentialscontroller = require('../controllers/SendingCredentials')
const emailsending = require('../controllers/emailc')


router.post('/send-otp', emailcontroller.sendotp)
router.post('/verify-otp', emailcontroller.verifyotp)
router.post('/sendcred', credentialscontroller.sendcred)
router.post('/sendpaymentreminder' , authenticate.authenticatetoken , emailsending.sendcustomnodi )

module.exports = router;