const express = require('express');
const router = express.Router();
const user = require("../controllers/Usercontroller")
const authenticate = require('../controllers/Authenticate')

router.post('/getlogo',user.fetchlogo)
router.post('/savesociallink',authenticate.authenticatetoken , user.setsociallinks)

module.exports = router;