const express = require('express');
const multer = require('multer');
const { storage } = require('../controllers/ImageController'); // Cloudinary config
const router = express.Router();

// Multer middleware to handle file upload
const upload = multer({ storage });

// API route to upload an image
router.post('/uploadlogo', upload.fields([{ name: 'logo', maxCount: 1 }]), async (req, res) => {
    console.log('File:', req.files['logo']); // Access the uploaded file
    console.log('Body:', req.body); // Access the request body
    const uploadedFile = req.files['logo'][0]; // Access the uploaded file
    res.json({ imageUrl: uploadedFile.path, imageId: uploadedFile.filename });
});


module.exports = router;
