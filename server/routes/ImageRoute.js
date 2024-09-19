const express = require('express');
const multer = require('multer');
const { storage } = require('../controllers/ImageController'); // Cloudinary config
const router = express.Router();

// Multer middleware to handle file upload
const upload = multer({ storage });

// API route to upload an image
router.post('/uploadlogo', upload.single('logo'), (req, res) => {
    console.log('File:', req.file); // Log the file object
    console.log('Body:', req.body); // Log other request data
    // req.file contains Cloudinary upload details
    res.json({ imageUrl: req.file.path, imageId: req.file.filename });
});

module.exports = router;
