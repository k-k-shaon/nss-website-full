// backend/routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const upload = require('../config/multer');
const fs = require('fs');
const path = require('path');

// CREATE event (with image upload)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file ? '/uploads/' + req.file.filename : '';
    const ev = await Event.create({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date || new Date(),
      time: req.body.time || '',
      location: req.body.location || '',
      attendees: req.body.attendees ? parseInt(req.body.attendees, 10) : 0,
      type: req.body.type || '',
      status: req.body.status || '',
      image: imagePath,
      image_url: req.body.image_url || '',
      registration_link: req.body.registration_link || ''
    });
    res.json(ev);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ all
router.get('/', async (req, res) => {
  const events = await Event.find().sort({ date: -1 });
  res.json(events);
});

// READ by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const existing = await Event.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Event not found' });

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      attendees: typeof req.body.attendees !== 'undefined' ? parseInt(req.body.attendees, 10) : existing.attendees,
      type: req.body.type,
      status: req.body.status,
      image_url: req.body.image_url,
      registration_link: req.body.registration_link
    };

    if (req.file) {
      // Delete previous image if it exists
      if (existing.image) {
        const oldImagePath = path.join(__dirname, '..', '..', 'public', existing.image);
        if (fs.existsSync(oldImagePath)) {
          try { fs.unlinkSync(oldImagePath); } catch (err) { console.warn('Failed to delete old event image:', err); }
        }
      }
      updateData.image = '/uploads/' + req.file.filename;
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event && event.image) {
      const imagePath = path.join(__dirname, '..', '..', 'public', event.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    await Event.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Event Registration Routes

// CREATE registration for an event
router.post('/:id/register', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const registration = await EventRegistration.create({
      event_id: req.params.id,
      event_title: event.title,
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      studentId: req.body.studentId,
      department: req.body.department,
      batch: req.body.batch,
      section: req.body.section,
      message: req.body.message
    });
    res.json(registration);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET all registrations for an event
router.get('/:id/registrations', async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ event_id: req.params.id }).sort({ createdAt: -1 });
    res.json(registrations);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET all registrations (admin)
router.get('/admin/all-registrations', async (req, res) => {
  try {
    const registrations = await EventRegistration.find().sort({ createdAt: -1 });
    res.json(registrations);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE registration
router.delete('/registrations/:regId', async (req, res) => {
  try {
    await EventRegistration.findByIdAndDelete(req.params.regId);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
