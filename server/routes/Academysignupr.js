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
router.post('/freetrialrequest', academyauth.freetrialrequest)
router.post('/fetchfreelist', authenticate.authenticatetoken, academyauth.fetchfreelist)
router.post('/freetrialsubmission', authenticate.authenticatetoken, academyauth.handlesubmitfreetrial)
router.post('/changeadmincreds', authenticate.authenticatetoken, academyauth.changeCreds)


module.exports = router;