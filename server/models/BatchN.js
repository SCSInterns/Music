const mongoose = require("mongoose");

const BatchDetailsSchema = new mongoose.Schema({
    academyname: {
        type: String,
        required: true,
    },
    batchname: {
        type: String,
        required: true,
    },
    currentstudentcount:
    {
        type: Number,
        default: 0,
    },
    maximumstudents: {
        type: Number,
        required: true,
    },
    course: {
        type: String,
        enum: ["Music", "Singing", "Dancing", "Art"],
        required: true,
    },
    // instrument / dance / art / singing types 
    specificDetails: {
        type: mongoose.Schema.Types.Mixed,
        required: function () {
            return this.course !== undefined;
        },
    },
    classtype: {
        type: String,
        enum: ["Theory", "Practical", "Both"],
        required: true,
        default: "Both",
    },
    schedule: [
        {
            day: {
                type: String,
                enum: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                ],
                required: true,
            },
            starttime: {
                type: String,
                required: true,
            },
            endtime: {
                type: String,
                required: true,
            },
            classtype: {
                type: String,
                enum: ["Theory", "Practical"],
                required: function () {
                    return this.classtype !== undefined;
                },
            },
        },
    ],
});

module.exports = mongoose.model("BatchDetails", BatchDetailsSchema);
