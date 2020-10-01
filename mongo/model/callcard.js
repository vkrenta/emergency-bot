const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  callCardId: { type: String, required: true, unique: true, index: true },
  responderId: { type: String },
  region: { type: String },
  callerNumber: { type: String },
  startDatetime: { type: Date, default: Date.now },
  patient: {
    name: String,
    age: String,
    sex: String,
    weight: String,
    diagnosis: String,
    helpProvided: String,
    helpComment: String,
    erResult: String,
    callcardId: String,
  },
  complain: { type: String },
  location: {
    district: { type: String },
    city: { type: String },
    street: { type: String },
    building: { type: String },
    apartment: { type: String },
    location_type: { type: String },
    address_type: { type: String },
    latitude: { type: String },
    longitude: { type: String },
  },
  callComment: { type: String },
  callPriority: { type: String },
  status: { type: String },
});

module.exports = mongoose.models['callcards'] || mongoose.model('callcards', schema, 'callcards');
