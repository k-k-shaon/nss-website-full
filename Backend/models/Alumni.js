// backend/models/Alumni.js
const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  batch: String,
  department: String,
  current_position: String,
  company: String,
  bio: String,
  email: String,
  phone: String,
  linkedin: String,
  facebook: String,
  avatar_url: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alumni', alumniSchema);
