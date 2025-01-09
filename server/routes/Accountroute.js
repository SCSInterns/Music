const express = require("express")
const router = express.Router();
const Account = require("../controllers/AccountsC")
const authenticate = require('../controllers/Authenticate')

router.post('/fetchaccountlist', authenticate.authenticatetoken, Account.fetchaccountlist)
router.post('/addpaymentinaccount', authenticate.authenticatetoken, Account.addpayment)
router.post('/addadvanceamount', authenticate.authenticatetoken, Account.advanceamount)

module.exports = router;    