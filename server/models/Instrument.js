const mongoose = require("mongoose");
const { Schema } = mongoose;

const Instruments = new Schema({
  academyname: {
    type: String,
    required: true,
  },
  instruments: {
    type: Map,  
    of: String, 
    required: true,
  },
});

module.exports = mongoose.model('Instrument', Instruments);
