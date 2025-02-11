const express = require("express")
const router = express.Router()
const authenticate = require("../controllers/Authenticate")
const Event = require("../controllers/EventTicket")

router.post("/bookticket", Event.booking)

module.exports = router