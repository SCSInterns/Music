const mongoose = require("mongoose");
const { Schema } = mongoose;

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Token', tokenSchema);