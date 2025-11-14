// backend/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  status: { type: String, default: "" },
  stars: { type: Number, default: 0 },
  team: { type: String, default: "" },
  technologies: [String],
  team_members: [String],
  image: String,
  content: String,
  github_url: String,
  demo_url: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
