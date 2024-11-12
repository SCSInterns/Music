const express = require('express');
const router = express.Router();
const authenticate = require('../controllers/Authenticate')
const batches = require('../controllers/Batches')

router.post('/addbatchesinfo', authenticate.authenticatetoken, batches.addBatchesCount)
router.post('/getbatchesdetails', authenticate.authenticatetoken, batches.getallbatches)
router.put('/updatebatchdetails', authenticate.authenticatetoken, batches.updatedetailsofbatch)
router.post('/assignbatch', authenticate.authenticatetoken, batches.assignbatches)
router.post('/getbatchdetail', authenticate.authenticatetoken, batches.getbatchdetails)
router.post('/getapplicantslist', authenticate.authenticatetoken, batches.handleapplicants)

module.exports = router 