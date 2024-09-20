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
  params: async (req, file) => {

    console.log(file)
    console.log(req.body) 

    const academyName = await req.body.academyname; // Get the academy name from request body

    console.log(" IN param : ", academyName)

    return {
      folder: 'uploads', // Optional folder structure
      public_id: `academies/${academyName}/Logo`, // Custom public_id including academy name
      allowed_formats: ['jpg', 'png'], // Allowed formats for the upload
    };
  },
});

module.exports = { cloudinary, storage };
