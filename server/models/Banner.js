const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
    academyname: {
        type: String,
        required: true,
    },
    imageUrls: {
        type: [String],
        required: true,
    }
});

module.exports = mongoose.model("Banner", BannerSchema);
