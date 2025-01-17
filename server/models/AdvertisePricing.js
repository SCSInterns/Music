
const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    limit: {
        type: Number,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    features: {
        type: [String],
        required: true,
    },
});

module.exports = mongoose.model('Advertise Pricing', pricingSchema);
