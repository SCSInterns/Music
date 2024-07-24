const express = require('express');
const router = express.Router();

const emailcontroller = require('../controllers/OtpSending')
const credentialscontroller = require('../controllers/SendingCredentials')

router.post('/send-otp', emailcontroller.sendotp)
router.post('/verify-otp', emailcontroller.verifyotp)
router.post('/sendcred', credentialscontroller.sendcred)

module.exports = router;