const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const fs = require('fs');
const path = require('path');

// Ensure gallery directory exists
const galleryDir = path.join(__dirname, '..', '..', 'public', 'gallery');
if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
}

// Metadata file to store captions and ordering
const metaFile = path.join(galleryDir, 'gallery_meta.json');

function loadMeta() {
  try {
    if (!fs.existsSync(metaFile)) return [];
    const raw = fs.readFileSync(metaFile, 'utf-8');
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      // Ensure new fields exist
      return data.map(m => ({
        id: m.id,
        caption: m.caption || '',
        title: m.title || '',
        order: m.order || 0,
      }));
    }
    return [];
  } catch (e) {
    console.error('Failed to read gallery metadata:', e);
    return [];
  }
}

function saveMeta(list) {
  try {
    fs.writeFileSync(metaFile, JSON.stringify(list, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write gallery metadata:', e);
  }
}

function normalizeOrder(list) {
  return list
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item, idx) => ({ ...item, order: idx + 1 }));
}

// Get all carousel images with caption and order
router.get('/', (req, res) => {
  fs.readdir(galleryDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to load images' });
    const imageFiles = files.filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));

    // Load meta and reconcile with actual files
    let meta = loadMeta();
    // Remove meta entries for files that no longer exist
    meta = meta.filter((m) => imageFiles.includes(m.id));
    // Add meta entries for new files
    const existingIds = new Set(meta.map((m) => m.id));
    let nextOrder = (meta.reduce((max, m) => Math.max(max, m.order || 0), 0) || 0) + 1;
    for (const f of imageFiles) {
      if (!existingIds.has(f)) {
        meta.push({ id: f, caption: '', title: '', order: nextOrder++ });
      }
    }
    meta = normalizeOrder(meta);
    saveMeta(meta);

    const images = meta.map((m) => ({ _id: m.id, image: `/gallery/${m.id}`, title: m.title || '', caption: m.caption || '', order: m.order }));
    res.json(images);
  });
});

// Upload image to gallery
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  // Move file from uploads to gallery
  const oldPath = req.file.path;
  const newPath = path.join(galleryDir, req.file.filename);

  fs.renameSync(oldPath, newPath);

  // Update metadata
  let meta = loadMeta();
  const nextOrder = (meta.reduce((max, m) => Math.max(max, m.order || 0), 0) || 0) + 1;
  const record = { id: req.file.filename, caption: req.body.caption || '', title: req.body.title || '', order: nextOrder };
  meta.push(record);
  meta = normalizeOrder(meta);
  saveMeta(meta);

  res.json({
    _id: record.id,
    image: `/gallery/${record.id}`,
    title: record.title,
    caption: record.caption,
    order: record.order,
  });
});

// Update caption or order for a gallery image
router.put('/:id', (req, res) => {
  const { caption, title, order } = req.body;
  let meta = loadMeta();
  const idx = meta.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  if (typeof caption === 'string') meta[idx].caption = caption;
  if (typeof title === 'string') meta[idx].title = title;

  if (order !== undefined && Number.isInteger(Number(order))) {
    // Clamp order within [1, meta.length]
    let newOrder = Math.max(1, Math.min(parseInt(order, 10), meta.length));
    // Assign and normalize to avoid duplicates
    meta[idx].order = newOrder;
    meta = normalizeOrder(meta);
  }

  saveMeta(meta);
  const updated = meta.find((m) => m.id === req.params.id);
  return res.json({ _id: updated.id, image: `/gallery/${updated.id}`, title: updated.title, caption: updated.caption, order: updated.order });
});

// Bulk reorder by array of ids
router.post('/reorder', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids array required' });
  let meta = loadMeta();
  const map = new Map(meta.map((m) => [m.id, m]));
  const newList = [];
  for (const id of ids) {
    if (map.has(id)) newList.push(map.get(id));
  }
  // Append any missing
  for (const m of meta) {
    if (!ids.includes(m.id)) newList.push(m);
  }
  const normalized = normalizeOrder(newList);
  saveMeta(normalized);
  return res.json(normalized.map((m) => ({ _id: m.id, image: `/gallery/${m.id}`, title: m.title || '', caption: m.caption, order: m.order })));
});

// Delete image from gallery
router.delete('/:id', (req, res) => {
  const filePath = path.join(galleryDir, req.params.id);
  fs.unlink(filePath, err => {
    if (err) return res.status(500).json({ error: 'Failed to delete image' });
    // Update metadata
    let meta = loadMeta();
    meta = meta.filter((m) => m.id !== req.params.id);
    meta = normalizeOrder(meta);
    saveMeta(meta);
    res.json({ ok: true });
  });
});

module.exports = router;
