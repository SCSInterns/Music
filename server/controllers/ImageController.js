// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,     
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage settings for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'uploads',   // Folder to store images in Cloudinary
      format: async (req, file) => {
        // Get the file's MIME type
        const mimeType = file.mimetype;
  
        // Check MIME type and return the appropriate format
        if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
          return 'jpg';
        } else if (mimeType === 'image/png') {
          return 'png';
        } else {
          throw new Error('Unsupported file type');
        }
      },
      public_id: (req, file) => file.originalname.split('.')[0], // Image name
    },
  });
  

module.exports = { cloudinary, storage };
