const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// 1. Schema Definition
const AboutSchema = new mongoose.Schema({
  mainTitle: { type: String, required: true },
  aboutDsc: { type: String, required: true },
  aboutBadge: { type: String, required: true },
  aboutImage: { type: String }
});

const About = mongoose.model('About', AboutSchema);

// GET: Fetch about section texts
router.get('/', async (req, res) => {
  try {
    let aboutData = await About.findOne();
    if (!aboutData) {
      aboutData = new About({
        mainTitle: "About Me",
        aboutDsc: "I am a creative developer passionate about building digital experiences.",
        aboutBadge: "My Journey",
        aboutImage: ""
      });
      await aboutData.save();
    }
    res.json({ success: true, data: aboutData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT: Update about section texts
router.put('/', async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    let aboutData = await About.findOne();
    if (!aboutData) {
      aboutData = new About(req.body);
    } else {
      aboutData.mainTitle = req.body.mainTitle || aboutData.mainTitle;
      aboutData.aboutDsc = req.body.aboutDsc || aboutData.aboutDsc;
      aboutData.aboutBadge = req.body.aboutBadge || aboutData.aboutBadge;
      aboutData.aboutImage = req.body.aboutImage || aboutData.aboutImage;
    }
    await aboutData.save();
    res.json({ success: true, data: aboutData });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
//POST: Create a new about
router.post('/', async (req, res) => {
  try {
    const aboutData = new About(req.body);
    await aboutData.save();
    res.json({ success: true, data: aboutData });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
//DELETE: Delete about
router.delete('/', async (req, res) => {
  try {
    const aboutData = await About.findByIdAndDelete(req.params.id);
    if (!aboutData) {
      return res.status(404).json({ success: false, error: 'About not found' });
    }
    res.json({ success: true, data: aboutData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
