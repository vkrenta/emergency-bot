const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  chatId: { type: String, required: true, unique: true, index: true },
  responderId: { type: String, required: true, unique: true, index: true },
  status: { type: String },
  reports: [{
    fullName: String,
    age: String,
    sex: String,
    weight: String,
    diagnosis: String,
    helpProvided: String,
    helpComment: String,
    erResult: String,
    callcardId: String

  }]
});



module.exports = mongoose.models['responders'] || mongoose.model('responders', schema, 'responders');