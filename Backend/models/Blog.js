// backend/models/Blog.js
const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  author: { type: String, default: 'Anonymous' },
  image: String,
  date: { type: Date, default: Date.now },
  postTime: { type: Date, default: Date.now },
  readTime: String
});
module.exports = mongoose.model('Blog', blogSchema);
