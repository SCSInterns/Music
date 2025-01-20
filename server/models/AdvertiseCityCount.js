const mongoose = require('mongoose');

const cityAdvertiseSchema = new mongoose.Schema({
    advertiseId: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        default: 0,
    },
});

// Ensure unique combinations of `advertiseId` and `city`
cityAdvertiseSchema.index({ advertiseId: 1, city: 1 }, { unique: true });

module.exports = mongoose.model('CityAdvertise', cityAdvertiseSchema);
