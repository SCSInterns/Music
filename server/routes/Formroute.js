const express = require('express');
const router = express.Router();
const formcontroller = require('../controllers/Formcontroller');
const authenticate = require('../controllers/Authenticate')

router.post('/academyregform', authenticate.authenticatetoken, formcontroller.handledynamicform)
router.post('/getform',formcontroller.getform) 
router.post('/savedata' , formcontroller.savedata)
router.post('/getdata', authenticate.authenticatetoken , formcontroller.handleapplicantdata)
router.post('/getdatabyid/:id', authenticate.authenticatetoken , formcontroller.finddatabyid)
module.exports = router 