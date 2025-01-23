// models/Slot.js
const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    slotNumber: {
        type: Number,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Marketing Banners', slotSchema);
