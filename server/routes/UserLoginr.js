const express = require('express');
const router = express.Router();
const Userc = require("../controllers/Userlogincontroller")
const authenticate = require('../controllers/Authenticate')


router.post('/setcredentials', authenticate.authenticatetoken, Userc.setusercredentials)
router.post('/resetcred', Userc.forgetpass)
router.post('/userlogin', Userc.loginuser)


module.exports = router;