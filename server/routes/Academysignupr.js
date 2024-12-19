const express = require("express");
const authenticate = require('../controllers/Authenticate')
const router = express.Router();
const academyauth = require('../controllers/AcademySignupc');
const cancelsubscription = require("../controllers/CancelSubscription")

router.post('/academysignup', academyauth.academy_signup);
router.post('/academylogin', academyauth.academy_login);
router.post('/academybyname', academyauth.academybyname)
router.post('/handlesubscriptionpayment', academyauth.handlepaymentaddition)
router.post('/verifysubscriptionpayment', academyauth.verifysubscriptionpayment)
router.post('/failedsubscriptionpayment', academyauth.rejectpayment)
router.post('/handlemanualsubspayment', authenticate.authenticatetoken, academyauth.handlemanualsubscriptionpayment)
router.post('/getsubspaymentlist', authenticate.authenticatetoken, academyauth.getinstallmentlist)
router.post('/cancelsubscription', authenticate.authenticatetoken, cancelsubscription.cancelsubscription)

module.exports = router;