const express = require('express');
const router = express.Router();
const authenticate = require('../controllers/Authenticate')
const MusicAcademy = require('../controllers/MusicAcademyc');

router.post('/academyreg', MusicAcademy.academy_details);
router.get('/preview/:id', MusicAcademy.preview)
router.put('/addpersonaldetail/:id', MusicAcademy.personaldetailsupdation)
router.put('/addacademytype/:id', MusicAcademy.academytypedetailsupdation)
router.post('/checkurl', MusicAcademy.handleurl)
router.post('/verifyurl', authenticate.authenticatetoken, MusicAcademy.verifyurl)

module.exports = router;