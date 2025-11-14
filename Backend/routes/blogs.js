// backend/routes/blogs.js
const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const upload = require('../config/multer');
const fs = require('fs');
const path = require('path');

// CREATE with image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file ? '/uploads/' + req.file.filename : '';
    const b = await Blog.create({
      title: req.body.title,
      description: req.body.description,
      content: req.body.content || '',
      author: req.body.author || 'Anonymous',
      image: imagePath,
      readTime: req.body.readTime || ''
    });
    res.json(b);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ all
router.get('/', async (req, res) => {
  const blogs = await Blog.find().sort({ postTime: -1 });
  res.json(blogs);
});

// READ by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const existing = await Blog.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Blog not found' });

    const updateData = {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      description: req.body.description,
      readTime: req.body.readTime
    };

    if (req.file) {
      // Delete previous image if exists
      if (existing.image) {
        const oldImagePath = path.join(__dirname, '..', '..', 'public', existing.image);
        if (fs.existsSync(oldImagePath)) {
          try { fs.unlinkSync(oldImagePath); } catch (err) { console.warn('Failed to delete old blog image:', err); }
        }
      }
      updateData.image = '/uploads/' + req.file.filename;
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog && blog.image) {
      const imagePath = path.join(__dirname, '..', '..', 'public', blog.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
