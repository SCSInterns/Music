const express = require('express');
const router = express.Router();
const authenticate = require('../controllers/Authenticate') 
const Profile = require('../controllers/ProfileController')

router.post('/fetchprofile',authenticate.authenticatetoken,Profile.profilecontroller)


module.exports = router