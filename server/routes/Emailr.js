const express = require('express');
const router = express.Router();

const emailcontroller = require('../controllers/OtpSending')

router.post('/send-otp' , emailcontroller.sendotp)
router.post('/verify-otp' , emailcontroller.verifyotp)

module.exports = router;