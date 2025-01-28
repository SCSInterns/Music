const express = require('express');
const router = express.Router();
const event = require('../controllers/EventCreation');
const authenticate = require("../controllers/Authenticate")
const Eventlocationc = require("../controllers/EventCreation")

router.post('/generateeventdescwithai', authenticate.authenticatetoken, event.generateAIDescription)
router.post('/createvenuedetails', authenticate.authenticatetoken, Eventlocationc.createVenueDetails)
router.post('/getvenuedetails', authenticate.authenticatetoken, Eventlocationc.getVenueDetails)

module.exports = router;