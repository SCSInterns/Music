const express = require('express');
const multer = require('multer');
const { storage } = require('../controllers/ImageController'); // Cloudinary config
const router = express.Router();

// Multer middleware to handle file upload
const upload = multer({ storage });

// API route to upload an image
router.post('/uploadlogo', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'academyname' }]),  async (req, res) => {
    console.log('File:', req.files['logo']); // Access the uploaded file
    console.log('Body:', req.body); // Access the request body

    const academyName = await req.body.academyname; // Get the academy name from request body

    console.log("Academy name:", academyName);
    if (!academyName) {
        return res.status(400).json({ error: 'Academy name is required' });
    }

    const uploadedFile = req.files['logo'][0]; // Access the uploaded file
    res.json({ imageUrl: uploadedFile.path, imageId: uploadedFile.filename });
});


module.exports = router;
