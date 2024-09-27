const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  academyname: {
    type: String,
    required: true,
  },
  imageUrls: {
    type: [String], // Array of image URLs
    required: true,
  }
});

module.exports = mongoose.model("Gallery", ImageSchema);
