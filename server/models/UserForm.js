const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserFormSchema = new Schema({
    academy_name: { type: String, required: true },
    role: { type: String, required: true },
    batchid: { type: String, required: true, default: '' },
    form_name: {
        type: String, required: true,

    },
    additionalFields: { type: Map, of: Schema.Types.Mixed },
    status: { type: String, required: true, default: "To be updated" },
    installmentDate: { type: String, required: true, default: "Yet to set" },
    attendance: { type: Number, default: 0 }
})

const UserForm = mongoose.model('User Form', UserFormSchema);

module.exports = UserForm;
