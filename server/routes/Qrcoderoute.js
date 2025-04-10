const express = require('express');
const router = express.Router();
const authenticate = require('../controllers/Authenticate')
const Qrcode = require("../controllers/QrcodeController")
const Attendance = require("../controllers/Attendacec")

router.post('/generateqr', authenticate.authenticatetoken, Qrcode.generateqrcode)
router.post('/fetchqr', authenticate.authenticatetoken, Qrcode.fetchqr)
router.post('/log-attendance', authenticate.authenticatetoken, Qrcode.attendance)
router.post('/getrecords', authenticate.authenticatetoken, Attendance.getattendance)
router.post("/generatefilmqr", Qrcode.generatefilmqr)

module.exports = router