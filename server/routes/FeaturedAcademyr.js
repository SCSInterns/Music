const express = require('express');
const router = express.Router();
const FeaturedAcademy = require('../controllers/FeaturedAcademies');

router.post('/featuredAcademies', FeaturedAcademy.featuredAcademies)



module.exports = router; 