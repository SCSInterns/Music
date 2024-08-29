const express = require('express');
const router = express.Router();
const authenticate = require('../controllers/Authenticate')
const Installment = require('../controllers/Installmentcontroller')


router.post('/addpaymentdetails/:studentId',authenticate.authenticatetoken,Installment.handlenextinstallmentdate)




module.exports = router