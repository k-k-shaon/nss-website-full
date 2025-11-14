// backend/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const methodOverride = require('method-override');
const cors = require('cors');

const eventsRouter = require('./routes/events');
const blogsRouter = require('./routes/blogs');
const adminRouter = require('./routes/admin');
const carouselRouter = require('./routes/carousel');
const projectsRouter = require('./routes/projects');
const alumniRouter = require('./routes/alumni');

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// connect mongo
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/niterscience', {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(()=>console.log('Mongo connected'))
  .catch(err=>console.error('Mongo err', err));

// middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// session (stored in Mongo)
app.use(session({
  secret: process.env.SESSION_SECRET || 'change_this_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/niterscience' }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// static public
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/gallery', express.static(path.join(__dirname, '..', 'public', 'gallery')));

// seed admin user if none
(async function seedAdmin() {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) return;
    const u = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!u) {
      await User.createFromPlain(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
      console.log('Seeded admin user:', process.env.ADMIN_EMAIL);
    }
  } catch (e) {
    console.error('Seed admin error', e);
  }
})();

// API routes
app.use('/api/events', eventsRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/carousel', carouselRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/alumni', alumniRouter);

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// fallback to index.html for SPA navigation (only for non-API routes)
// Removed - not needed for API-only backend

app.listen(PORT, ()=>console.log('Server running on port', PORT));
