const mongoose = require("mongoose");
const { Schema } = mongoose;

const ParticularBatch = new Schema({
    academyname: {
        type: String,
        required: true,
    },
    noofstudents:
    {
        type: Number,
        required: true,
        default: 0
    },
    batchname:
    {
        type: String,
        required: true,
        unique: true
    },
    starttime:
    {
        type: String,
        required: true,
    },
    endtime:
    {
        type: String,
        required: true,
        validate: {
            validator: function (endTime) {
                const [startHours, startMinutes] = this.starttime.split(':').map(Number);
                const [endHours, endMinutes] = endTime.split(':').map(Number);
                return (endHours > startHours) || (endHours === startHours && endMinutes > startMinutes);
            },
            message: "End time must be later than start time."
        }
    },
    days:
    {
        type: [String],
        required: true
    },
    batchtype:
    {
        type: String,
        required: true,
    },
    instrument_types: [
        {
            type: { type: String, required: true },
            quantity: { type: Number, required: true },
            currentstudentcount: { type: Number, default: 0 },
        }
    ],
    maximum_no_of_students:
    {
        type: Number,
        required: true,
    },
    practicaldays:
    {
        type: [String],
        required: true
    },
    theorydays:
    {
        type: [String],
        required: true
    },
    non_instrument_students_count:
    {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model("BatchesSpec", ParticularBatch);