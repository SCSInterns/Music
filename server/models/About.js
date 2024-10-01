const mongoose = require("mongoose");

const AboutSchema = new mongoose.Schema({
  academyname: {
    type: String,
    required: true,
  },
  description:
  {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("About", AboutSchema);
