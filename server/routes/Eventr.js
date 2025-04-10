const express = require('express');
const router = express.Router();
const event = require('../controllers/EventCreation');
const authenticate = require("../controllers/Authenticate")
const Eventlocationc = require("../controllers/EventCreation")
const SeatC = require("../controllers/SeatLayoutC")
const AcademyMngC = require("../controllers/AcademyEventMng")
const SeatBooking = require("../controllers/SeatLayoutBooking")

router.post('/generateeventdescwithai', authenticate.authenticatetoken, event.generateAIDescription)
router.post('/createvenuedetails', authenticate.authenticatetoken, Eventlocationc.createVenueDetails)
router.post('/getvenuedetails', authenticate.authenticatetoken, Eventlocationc.getVenueDetails)
router.post('/createseatlayout', authenticate.authenticatetoken, SeatC.validateCreateLayout, SeatC.createlayout)
router.post('/getseatlayout', authenticate.authenticatetoken, SeatC.getseatlayout)
router.post("/createeventdetails", authenticate.authenticatetoken, event.createEventDetails)
router.post("/insertpricingplans", authenticate.authenticatetoken, event.insertPricingPlans)
router.post("/createextradetails", authenticate.authenticatetoken, event.createExtraDetails)
router.post("/geteventdetails", event.getEventDetails)
router.post("/inserteventcreds", authenticate.authenticatetoken, Eventlocationc.StoreCreds)
router.post("/publishevent", authenticate.authenticatetoken, event.publishEvent)
router.post("/addsubscribemail", event.addEmail)
router.post("/geteventslistforacademy", authenticate.authenticatetoken, AcademyMngC.getEventDetailsAcademy)
router.post("/setseatlayoutticket", authenticate.authenticatetoken, event.insertPricingPlansLayout)
router.post("/bookseat", SeatBooking.SeatLayoutBooking)

module.exports = router;