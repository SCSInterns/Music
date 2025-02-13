const express = require("express")
const router = express.Router()
const authenticate = require("../controllers/Authenticate")
const Event = require("../controllers/EventTicket")

router.post("/bookticket", Event.getPaymentCreds)
router.post("/confirmbooking", Event.booking)

module.exports = router