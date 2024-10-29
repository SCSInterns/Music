const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema({
    academyname: {
        type: String,
        required: true,
    },
    no_of_batches_per_day:
    {
        type: Number,
        required: true
    },
    no_of_classes: {
        type: Number,
        required: true
    },
    no_of_instruments_per_class:
    {
        type: Number,
        required: true
    },
    instrument_types: [
        {
            type: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    max_no_of_students_per_day:
    {
        type: Number,
        required: true
    },
    max_no_of_students_per_batch:
    {
        type: Number,
        required: true
    },
    currentstudentcount:
    {
        type: Number,
        required: true,
        default: 0
    },
    duration:
    {
        type: Number,
        required: true
    },
    academy_start_time:
    {
        type: String,
        required: true
    },
    academy_end_time:
    {
        type: String,
        required: true,
        validate: {
            validator: function (endTime) {
                const [startHours, startMinutes] = this.academy_start_time.split(':').map(Number);
                const [endHours, endMinutes] = endTime.split(':').map(Number);
                return (endHours > startHours) || (endHours === startHours && endMinutes > startMinutes);
            },
            message: "End time must be later than start time."
        }
    },

});

module.exports = mongoose.model("Batches", BatchSchema);