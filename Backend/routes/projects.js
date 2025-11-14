// backend/routes/projects.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const upload = require('../config/multer');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// CREATE project
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file ? '/uploads/' + req.file.filename : '';
    const technologies = req.body.technologies ? 
      (Array.isArray(req.body.technologies) ? req.body.technologies : req.body.technologies.split(',').map(t => t.trim())) : [];
    const team_members = req.body.team_members ? 
      (Array.isArray(req.body.team_members) ? req.body.team_members : req.body.team_members.split(',').map(t => t.trim())) : [];
    
    const project = await Project.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      status: req.body.status || '',
      stars: req.body.stars ? parseInt(req.body.stars, 10) : 0,
      team: req.body.team || '',
      technologies,
      team_members,
      content: req.body.content,
      github_url: req.body.github_url,
      demo_url: req.body.demo_url,
      image: imagePath
    });
    res.json(project);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE project
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      status: req.body.status,
      team: req.body.team,
      content: req.body.content,
      github_url: req.body.github_url,
      demo_url: req.body.demo_url,
    };
    if (typeof req.body.stars !== 'undefined') {
      updateData.stars = parseInt(req.body.stars, 10) || 0;
    }
    
    if (req.body.technologies) {
      updateData.technologies = Array.isArray(req.body.technologies) ? 
        req.body.technologies : req.body.technologies.split(',').map(t => t.trim());
    }
    
    if (req.body.team_members) {
      updateData.team_members = Array.isArray(req.body.team_members) ? 
        req.body.team_members : req.body.team_members.split(',').map(t => t.trim());
    }
    
    if (req.file) {
      updateData.image = '/uploads/' + req.file.filename;
    }
    
    const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
