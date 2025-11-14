// backend/models/Event.js
const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  time: String,
  location: String,
  attendees: { type: Number, default: 0 },
  type: String,
  status: String,
  image: String,
  image_url: String,
  registration_link: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Event', eventSchema);
