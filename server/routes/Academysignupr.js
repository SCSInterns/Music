const express = require("express")
const router = express.Router();
const academyauth = require('../controllers/AcademySignupc');

router.post('/academysignup', academyauth.academy_signup);
router.post('/academylogin',academyauth.academy_login);

module.exports = router;