const express = require('express');
const router = express.Router();
const superadminauthc = require('../controllers/Superadminc');
const authenticate = require('../controllers/Authenticate')

router.post('/superadminsignup', superadminauthc.superadmin_signup);
router.post('/superadminlogin', superadminauthc.superadmin_login);
router.put('/academyacess/:id', authenticate.authenticatetoken , superadminauthc.academy_access)
router.post('/academydetails', authenticate.authenticatetoken,superadminauthc.getallacademydetails)
router.post('/superadmindetails', authenticate.authenticatetoken,superadminauthc.getsuperinfo)

module.exports = router;