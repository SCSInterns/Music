const express = require('express');
const router = express.Router();
const formcontroller = require('../controllers/Formcontroller');
const authenticate = require('../controllers/Authenticate')

router.post('/academyregform', authenticate.authenticatetoken, formcontroller.handledynamicform)
router.post('/getform',formcontroller.getform) 
router.post('/savedata' , formcontroller.savedata)

module.exports = router 