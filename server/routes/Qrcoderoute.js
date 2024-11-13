const express = require('express');
const router = express.Router();
const authenticate = require('../controllers/Authenticate')
const Qrcode = require("../controllers/QrcodeController")

router.post('/generateqr', authenticate.authenticatetoken, Qrcode.generateqrcode)
router.post('/fetchqr', authenticate.authenticatetoken, Qrcode.fetchqr)
router.post('/log-attendance', authenticate.authenticatetoken, Qrcode.attendance)

module.exports = router