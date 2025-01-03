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

// e.g

// {
//     "academyname": "Harmony Academy",
//     "batchname": "String Master",
//     "maximumstudents": 20,
//     "course": "Music",
//     "specificDetails": {
//         "instruments": ["Guitar", "Tabla"]
//     },
//     "classtype": "Both",
//     "schedule": [
//         {
//             "day": "Monday",
//             "starttime": "4:00 PM",
//             "endtime": "5:00 PM",
//             "classtype": "Theory"
//         },
//         {
//             "day": "Wednesday",
//             "starttime": "5:00 PM",
//             "endtime": "6:00 PM",
//             "classtype": "Theory"
//         },
//         {
//             "day": "Friday",
//             "starttime": "5:00 PM",
//             "endtime": "6:00 PM",
//             "classtype": "Practical"
//         }
//     ]
// }
