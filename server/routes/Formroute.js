const express = require('express');
const router = express.Router();
const formcontroller = require('../controllers/Formcontroller');
const authenticate = require('../controllers/Authenticate')

router.post('/academyregform', authenticate.authenticatetoken, formcontroller.handledynamicform)


module.exports = router 