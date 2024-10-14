const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  academyname: {
    type: String,
    required: true,
  },
  eventname: {
    type: String,
    required: true,
  },
  description:
  {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true
  },
  time:
  {
    type: String,
    required: true
  },
  location:
  {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Event", EventSchema);
