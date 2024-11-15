
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    studentid: {
        type: String,
        required: true,
    },
    academyname: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    batchid: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    },
    currentrollno:
    {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
