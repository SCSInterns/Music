const express = require('express');
const multer = require('multer');
const authenicate = require('../controllers/Authenticate')
const { storage, Gallerystorage, EventStorage, AboutStorage, InstrumentStorage, MentorsStorage, BannersStorage } = require('../controllers/ImageController');
const gallery = require('../controllers/GalleryController')
const instrument = require('../controllers/Instrumentc')
const router = express.Router();

// Multer middleware to handle file upload
const upload = multer({ storage });

const galleryUpload = multer({ storage: Gallerystorage });

const eventUpload = multer({ storage: EventStorage })

const aboutUpload = multer({ storage: AboutStorage })

const instrumentUpload = multer({ storage: InstrumentStorage })

const profileUpload = multer({ storage: MentorsStorage })

const bannerUpload = multer({ storage: BannersStorage })

// API route to upload an image
router.post('/uploadlogo', upload.fields([{ name: 'logo', maxCount: 1 }]), async (req, res) => {
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

router.post("/uploadbannerphotos", bannerUpload.array("images", 5), (req, res) => {
    try {
        const urls = req.files.map((file) => file.path);
        res.json({ urls });
    } catch (error) {
        console.error("Error uploading to Cloudinary", error);
        res.status(500).json({ error: "Upload failed" });
    }
});

router.post('/uploadeventimage', eventUpload.single('picture'), (req, res) => {
    try {
        const uploadedFile = req.file;
        res.json({ imageUrl: uploadedFile.path, imageId: uploadedFile.filename });
    } catch (error) {
        console.error("Error uploading to Cloudinary", error);
        res.status(500).json({ error: "Upload failed" });
    }
});

router.post('/uploadaboutimage', aboutUpload.single('picture'), (req, res) => {
    try {
        const uploadedFile = req.file;
        res.json({ imageUrl: uploadedFile.path, imageId: uploadedFile.filename });
    } catch (error) {
        console.error("Error uploading to Cloudinary", error);
        res.status(500).json({ error: "Upload failed" });
    }
});

router.post('/uploadintrumentimage', instrumentUpload.single('picture'), (req, res) => {
    try {
        const uploadedFile = req.file;
        res.json({ imageUrl: uploadedFile.path, imageId: uploadedFile.filename });
    } catch (error) {
        console.error("Error uploading to Cloudinary", error);
        res.status(500).json({ error: "Upload failed" });
    }
});

router.post('/uploadmentorimage', profileUpload.single('picture'), (req, res) => {
    try {
        const uploadedFile = req.file;
        res.json({ imageUrl: uploadedFile.path, imageId: uploadedFile.filename });
    } catch (error) {
        console.error("Error uploading to Cloudinary", error);
        res.status(500).json({ error: "Upload failed" });
    }
});


router.put('/uploadgallerytodb', authenicate.authenticatetoken, gallery.saveImageUrls)
router.post('/uploadevents', authenicate.authenticatetoken, gallery.handleevents)
router.post('/uploadabout', authenicate.authenticatetoken, gallery.handleabout)
router.post('/uploadinstrument', authenicate.authenticatetoken, instrument.handleInstrument)
router.post('/addmentors', authenicate.authenticatetoken, gallery.handleMentors)
router.post('/addstats', authenicate.authenticatetoken, gallery.handlestats)
router.put('/addbanner', authenicate.authenticatetoken, gallery.saveBanners)


module.exports = router;
