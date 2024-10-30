const express = require('express');
const router = express.Router();
const authenticate = require('../controllers/Authenticate')
const batches = require('../controllers/Batches')

router.post('/addbatchesinfo', authenticate.authenticatetoken, batches.addBatchesCount)

router.post('/addbatchspecs', authenticate.authenticatetoken, batches.addBatchSpecs)


module.exports = router 