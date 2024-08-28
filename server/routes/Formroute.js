const express = require('express');
const router = express.Router();
const formcontroller = require('../controllers/Formcontroller');
const authenticate = require('../controllers/Authenticate')

router.post('/academyregform', authenticate.authenticatetoken, formcontroller.handledynamicform)
router.post('/getform',formcontroller.getform) 
router.post('/savedata' , formcontroller.savedata)
router.post('/getdata', authenticate.authenticatetoken , formcontroller.handleapplicantdata)
router.post('/getdatabyid/:id', authenticate.authenticatetoken , formcontroller.finddatabyid)
router.put('/updatestatus/:id' , authenticate.authenticatetoken , formcontroller.handlestatus)
router.put('/updateinstallment/:id', authenticate.authenticatetoken , formcontroller.handleinstallment)

module.exports = router 