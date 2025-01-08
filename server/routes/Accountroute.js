const express = require("express")
const router = express.Router();
const Account = require("../controllers/AccountsC")
const authenticate = require('../controllers/Authenticate')

router.post('/fetchaccountlist', authenticate.authenticatetoken, Account.fetchaccountlist)

module.exports = router;    