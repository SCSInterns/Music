const express = require('express');
const router = express.Router();
const superadminauthc = require('../controllers/Superadminc');
const authenticate = require('../controllers/Authenticate')
const Demo = require("../controllers/DemoC")

router.post('/superadminsignup', superadminauthc.superadmin_signup);
router.post('/superadminlogin', superadminauthc.superadmin_login);
router.put('/academyacess/:id', authenticate.authenticatetoken, superadminauthc.academy_access)
router.post('/academydetails', authenticate.authenticatetoken, superadminauthc.getallacademydetails)
router.post('/superadmindetails', authenticate.authenticatetoken, superadminauthc.getsuperinfo)
router.put('/academycredentials/:id', authenticate.authenticatetoken, superadminauthc.credsetup)
router.get('/detailsofadminbyid/:id', authenticate.authenticatetoken, superadminauthc.admindetailsbyid)
router.post('/filterforaccess', authenticate.authenticatetoken, superadminauthc.statusFilter)
router.post('/savedemoinquiry', Demo.savedemodata)
router.post('/getdemodata', authenticate.authenticatetoken, Demo.getdemodata)

module.exports = router;