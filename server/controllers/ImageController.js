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

    return {
      folder: 'uploads',
      public_id: `academies/Logo`,
      allowed_formats: ['jpg', 'png', 'jpeg'],
    };
  },
});

const Gallerystorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'galleryphotos',
      public_id: file.originalname.split('.')[0],
      allowed_formats: ['jpg', 'png', 'jpeg'],
    };
  },
});

const EventStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'Event',
      public_id: file.originalname.split('.')[0],
      allowed_formats: ['jpg', 'png', 'jpeg'],
    };
  },
});

const AboutStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'About',
      public_id: file.originalname.split('.')[0],
      allowed_formats: ['jpg', 'png', 'jpeg'],
    };
  },
});

const InstrumentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'Instruments',
      public_id: file.originalname.split('.')[0],
      allowed_formats: ['jpg', 'png', 'jpeg'],
    };
  },
});

const MentorsStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'Mentor',
      public_id: file.originalname.split('.')[0],
      allowed_formats: ['jpg', 'png', 'jpeg'],
    };
  },
});

const BannersStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'Banner',
      public_id: file.originalname.split('.')[0],
      allowed_formats: ['jpg', 'png', 'jpeg'],
    };
  },
});

const QrStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'Qrcode',
      public_id: file.originalname.split('.')[0],
      allowed_formats: ['jpg', 'png', 'jpeg'],
    };
  },
});

const AdvertiseStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'Advertise',
      public_id: file.originalname.split('.')[0] || Date.now(),
      allowed_formats: ['jpg', 'png', 'jpeg'],
    };
  },
});

module.exports = { cloudinary, storage, Gallerystorage, EventStorage, AboutStorage, InstrumentStorage, MentorsStorage, BannersStorage, QrStorage, AdvertiseStorage };
