const mongoose = require('mongoose');
const { Schema } = mongoose;


const formSchema = new Schema({
  academy_name: { type: String, required: true },
  role: { type: String, required: true },
  // dynamic fields 
  additionalFields: { type: Map, of: Schema.Types.Mixed },
});

const Academy = mongoose.model('Registration Form', formSchema);

module.exports = Academy;
