const express = require("express")
const router = express.Router();
const Account = require("../controllers/AccountsC")
const authenticate = require('../controllers/Authenticate')

router.post('/fetchaccountlist', authenticate.authenticatetoken, Account.fetchaccountlist)
router.post('/fetchparticularaccount', authenticate.authenticatetoken, Account.fetchparticularaccount)
router.post('/addpaymentinaccount', authenticate.authenticatetoken, Account.addpayment)
router.post('/addadvanceamount', authenticate.authenticatetoken, Account.advanceamount)
router.post('/transactiondata', authenticate.authenticatetoken, Account.fetchtransactiondata)
router.post('/fetchacademyaccount', authenticate.authenticatetoken, Account.fetchstats)
router.post('/fetchcustomstats', authenticate.authenticatetoken, Account.customstats)


module.exports = router;    