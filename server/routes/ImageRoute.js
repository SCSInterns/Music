const express = require('express');
const multer = require('multer');
const authenicate = require('../controllers/Authenticate')
const { storage, Gallerystorage } = require('../controllers/ImageController'); 
const gallery = require('../controllers/GalleryController')
const router = express.Router();

// Multer middleware to handle file upload
const upload = multer({ storage });

const galleryUpload = multer({ storage: Gallerystorage });

// API route to upload an image
router.post('/uploadlogo', upload.fields([{ name: 'logo', maxCount: 1 }]), async (req, res) => {
    console.log('File:', req.files['logo']); // Access the uploaded file
    console.log('Body:', req.body); // Access the request body
    const uploadedFile = req.files['logo'][0]; // Access the uploaded file
    res.json({ imageUrl: uploadedFile.path, imageId: uploadedFile.filename });
});

router.post("/uploadgalleryphotos", galleryUpload.array("images", 10), (req, res) => {
    try {
        const urls = req.files.map((file) => file.path);
        res.json({ urls });
    } catch (error) {
        console.error("Error uploading to Cloudinary", error);
        res.status(500).json({ error: "Upload failed" });
    }
}); 

router.put('/uploadgallerytodb' , authenicate.authenticatetoken , gallery.saveImageUrls  )


module.exports = router;
