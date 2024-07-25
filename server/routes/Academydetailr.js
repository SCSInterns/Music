const express = require('express');
const router = express.Router();
const authenticate = require('../controllers/Authenticate')
const MusicAcademy = require('../controllers/MusicAcademyc');

router.post('/academyreg', MusicAcademy.academy_details);
router.get('/preview/:id', authenticate.authenticatetoken, MusicAcademy.preview)
router.put('/addpersonaldetail/:id', MusicAcademy.personaldetailsupdation)
router.put('/addfranchisedetails/:id', MusicAcademy.franchiseupdation)

module.exports = router;