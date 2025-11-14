// backend/routes/alumni.js
const express = require('express');
const router = express.Router();
const Alumni = require('../models/Alumni');
const upload = require('../config/multer');
const fs = require('fs');
const path = require('path');

// GET all alumni
router.get('/', async (req, res) => {
  try {
    const alumni = await Alumni.find().sort({ createdAt: -1 });
    res.json(alumni);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET single alumni
router.get('/:id', async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) return res.status(404).json({ error: 'Alumni not found' });
    res.json(alumni);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// CREATE alumni
router.post('/', upload.single('avatar'), async (req, res) => {
  try {
    const avatarPath = req.file ? '/uploads/' + req.file.filename : '';
    const alumni = await Alumni.create({
      fullname: req.body.fullname,
      batch: req.body.batch,
      department: req.body.department,
      current_position: req.body.current_position,
      company: req.body.company,
      bio: req.body.bio,
      email: req.body.email,
      phone: req.body.phone,
      linkedin: req.body.linkedin,
      facebook: req.body.facebook,
      avatar_url: avatarPath
    });
    res.json(alumni);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE alumni
router.put('/:id', upload.single('avatar'), async (req, res) => {
  try {
    const existing = await Alumni.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Alumni not found' });

    const updateData = {
      fullname: req.body.fullname,
      batch: req.body.batch,
      department: req.body.department,
      current_position: req.body.current_position,
      company: req.body.company,
      bio: req.body.bio,
      email: req.body.email,
      phone: req.body.phone,
      linkedin: req.body.linkedin,
      facebook: req.body.facebook,
    };

    if (req.file) {
      // Remove old avatar if present
      if (existing.avatar_url) {
        const oldAvatarPath = path.join(__dirname, '..', '..', 'public', existing.avatar_url);
        if (fs.existsSync(oldAvatarPath)) {
          try { fs.unlinkSync(oldAvatarPath); } catch (err) { console.warn('Failed to delete old alumni avatar:', err); }
        }
      }
      updateData.avatar_url = '/uploads/' + req.file.filename;
    }

    const updated = await Alumni.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE alumni
router.delete('/:id', async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (alumni && alumni.avatar_url) {
      const imagePath = path.join(__dirname, '..', '..', 'public', alumni.avatar_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    await Alumni.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
