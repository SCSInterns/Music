const express = require('express');
const router = express.Router();
const event = require('../controllers/EventCreation');
const authenticate = require("../controllers/Authenticate")
const Eventlocationc = require("../controllers/EventCreation")
const SeatC = require("../controllers/SeatLayoutC")

router.post('/generateeventdescwithai', authenticate.authenticatetoken, event.generateAIDescription)
router.post('/createvenuedetails', authenticate.authenticatetoken, Eventlocationc.createVenueDetails)
router.post('/getvenuedetails', authenticate.authenticatetoken, Eventlocationc.getVenueDetails)
router.post('/createseatlayout', authenticate.authenticatetoken, SeatC.validateCreateLayout, SeatC.createlayout)
router.post('/getseatlayout', authenticate.authenticatetoken, SeatC.getseatlayout)
router.post("/createeventdetails", authenticate.authenticatetoken, event.createEventDetails)
router.post("/insertpricingplans", authenticate.authenticatetoken, event.insertPricingPlans)
router.post("/createextradetails", authenticate.authenticatetoken, event.createExtraDetails)
router.post("/geteventdetails", event.getEventDetails)

module.exports = router;