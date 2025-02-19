const mongoose = require('mongoose');

const UserEmailsMarketingSchema = new mongoose.Schema({
    email: {
        type: String,
        Unique: true,
        required: true
    },
    location:
    {
        type: String,
        required: true
    }
})

const UserEmailsMarketing = mongoose.model('UserEmailsMarketing', UserEmailsMarketingSchema);

module.exports = UserEmailsMarketing;