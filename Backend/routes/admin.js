// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');

// Get all messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create message (contact form)
router.post('/messages', async (req, res) => {
  try {
    const { name, fullName, email, subject, message } = req.body;
    const msg = await Message.create({ 
      fullName: fullName || name,
      email, 
      subject, 
      message 
    });
    res.json(msg);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete message
router.delete('/messages/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// login (create session)
router.post('/login', express.json(), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ status:'error', message: 'Invalid credentials' });
    const ok = await user.validatePassword(password);
    if (!ok) return res.status(401).json({ status:'error', message: 'Invalid credentials' });
    req.session.admin = { id: user._id, email: user.email };
    res.json({ status: 'success', message: 'Logged in' });
  } catch (e) {
    res.status(500).json({ status:'error', message: e.message });
  }
});

// current admin info
router.get('/me', (req, res) => {
  if (req.session && req.session.admin) {
    return res.json({
      isAdmin: true,
      user: req.session.admin,
    });
  }
  res.status(401).json({ isAdmin: false });
});

// logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ status: 'ok' }));
});

module.exports = router;
