const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// 1. Basic Middlewares
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'portfolio-app', 'dist', 'portfolio-app', 'browser')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 5000;
const mongoURI = 'mongodb://127.0.0.1:27017/portfolioDB';

mongoose.connect(mongoURI)
  .then(() => console.log('Successfully connected to MongoDB...'))
  .catch(err => console.error('MongoDB connection error:', err));

const fs = require('fs');
const multer = require('multer');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

//  upload images
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl: imageUrl });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


const homeRoutes = require('./home');
const projectRoutes = require('./project');
const contactRoutes = require('./contact');
const experienceRoutes = require('./experience');
const skillRoutes = require('./skills');
const aboutRoutes = require('./about');

app.use('/api/home', homeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/about', aboutRoutes);

app.get('/status', (req, res) => {
  res.json({
    status: 'Server is running successfully!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    port: PORT,
    time: new Date()
  });
});
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'portfolio-app', 'dist', 'portfolio-app', 'browser', 'index.html'));
});

app.listen(PORT, () => {
  console.log(` Server is running on: http://localhost:${PORT}`);
  console.log(`Serving static files from root directory: ${__dirname}`);
});
