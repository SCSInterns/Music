const express = require('express');
const router = express.Router();
const user = require("../controllers/Usercontroller")
const authenticate = require('../controllers/Authenticate')

router.post('/getlogo', user.fetchlogo)
router.post('/savesociallink', authenticate.authenticatetoken, user.setsociallinks)
router.post('/getimages', user.getimages)
router.post('/getabout', user.getabout)
router.post('/getinstrument', user.getinstruments)
router.post('/getevents', user.getevents)
router.post('/knowmoredetails', user.knowmore)
router.post('/getvideos', user.getvideos)
router.post('/getacademydetails', user.academydetails)
router.post('/getsociallinks', user.sociallinks)


module.exports = router;