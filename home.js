const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// 1. Schema Definition
const HomeSchema = new mongoose.Schema({
  headline: { type: String },
  mainTitle: { type: String },
  subTitle: { type: String },
  heroDesc: { type: String },
  resumePdf: { type: String },
  heroImage: { type: String }
});

const Home = mongoose.model('Home', HomeSchema);


// GET: Fetch home landing section texts
router.get('/', async (req, res) => {
  try {
    let homeData = await Home.findOne();
    if (!homeData) {
      homeData = new Home({
        headline: "Hello World",
        mainTitle: "Developer Portfolio",
        subTitle: "Full Stack Engineer",
        heroDesc: "Welcome to my portfolio",
        resumePdf: "",
        heroImage: ""
      });
      await homeData.save();
    }
    res.json({ success: true, data: homeData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT: Update home landing section texts

router.put('/', async (req, res) => {
  try {
    const homeData = await Home.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    
    res.json({ success: true, data: homeData });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});


//POST: Create a new home
router.post('/', async (req, res) => {
  try {
    const homeData = new Home(req.body);
    await homeData.save();
    res.json({ success: true, data: homeData });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
//DELETE: Delete home
router.delete('/', async (req, res) => {
  try {
    const homeData = await Home.findByIdAndDelete(req.params.id);
    if (!homeData) {
      return res.status(404).json({ success: false, error: 'Home not found' });
    }
    res.json({ success: true, data: homeData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Export Router
module.exports = router;
