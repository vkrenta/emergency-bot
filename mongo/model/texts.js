const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  textId: { type: Number, index: true, required: true, unique: true },
  name: { type: String, required: true },
  text: String,
  options: Object
});

module.exports =
  mongoose.models['texts'] || mongoose.model('texts', schema, 'texts');
