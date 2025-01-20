const express = require('express');
const router = express.Router();
const AdvertiseC = require('../controllers/AdvertiseC');
const authenticate = require('../controllers/Authenticate');

router.post('/allentries', authenticate.authenticatetoken, AdvertiseC.allentries);
router.post('/newentry', authenticate.authenticatetoken, AdvertiseC.newEntry);
router.post('/updateentry', authenticate.authenticatetoken, AdvertiseC.updateEntry);
router.post('/deleteentry', authenticate.authenticatetoken, AdvertiseC.deleteEntry);
router.post('/paylateradvertise', authenticate.authenticatetoken, AdvertiseC.handleadvertisepayment)
router.post('/getacademyadvplans', authenticate.authenticatetoken, AdvertiseC.getadvertiseplans)
router.post('/getalladvertise', authenticate.authenticatetoken, AdvertiseC.getalladvertiseapplications)
router.post('/addadvrpayment', authenticate.authenticatetoken, AdvertiseC.addadvrpayment)

module.exports = router;