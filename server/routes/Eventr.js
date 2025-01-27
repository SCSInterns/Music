const express = require('express');
const router = express.Router();
const event = require('../controllers/EventCreation');
const authenticate = require("../controllers/Authenticate")

router.post('/generateeventdescwithai', authenticate.authenticatetoken, event.generateAIDescription)

module.exports = router;