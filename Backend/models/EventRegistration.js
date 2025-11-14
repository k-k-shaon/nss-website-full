// backend/models/EventRegistration.js
const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  event_title: String,
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  studentId: String,
  department: String,
  batch: String,
  section: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
