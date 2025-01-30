const mongoose = require('mongoose');
const { Schema } = mongoose;

const dynamicFieldSchema = new Schema({
    label: { type: String, required: true },
    placeholder: { type: String, default: "" },
    type: {
        type: String,
        required: true,
        enum: ["text", "email", "radio", "textarea", "dropdown-course", "mobile-no", "checkbox", "dropdown", "number"],
    },
    options: { type: [String], default: [] },
    courseDetails: [
        {
            course: { type: String, required: true },
            fees: { type: String, required: true },
        },
    ],
});

const formSchema = new Schema({
    academy_name: { type: String, required: true },
    role: { type: String, required: true },
    form_name: { type: String, required: true },
    additionalFields: { type: [dynamicFieldSchema], default: [] },
    status: { type: String, required: true, default: "To be updated" },
    fees: { type: String, required: true, default: "Yet to set" },
    installmentDate: { type: String, required: true, default: "Yet to set" },
});

formSchema.index({ academy_name: 1 })

const Academy = mongoose.model('Registration Form', formSchema);

module.exports = Academy;
