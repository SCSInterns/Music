const express = require('express');
const router = express.Router();
const user = require("../controllers/Usercontroller")

router.post('/getlogo',user.fetchlogo)

module.exports = router;