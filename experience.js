const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// 1. Schema Definition
const SingleExperienceSchema = new mongoose.Schema({
  jobHistory: { type: String, required: true },
  jobTitle: { type: String, required: true },
  jobDesc: { type: String, required: true }
});

const ExperiencesDocSchema = new mongoose.Schema({
  experienceList: [SingleExperienceSchema]
});

const ExperienceDoc = mongoose.model('ExperienceDoc', ExperiencesDocSchema);

// GET: Retrieve the single experience document containing the list
router.get('/', async (req, res) => {
  try {
    let experienceDoc = await ExperienceDoc.findOne();
    if (!experienceDoc) {
      experienceDoc = new ExperienceDoc({
        experienceList: [
          {
            jobHistory: "2024 - Present",
            jobTitle: "Lead Frontend Engineer",
            jobDesc: "Leading development of next-generation visual styling architectures."
          }
        ]
      });
      await experienceDoc.save();
    }
    res.json({ success: true, data: experienceDoc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST: Add a new experience
router.post('/', async (req, res) => {
  try {
    const newExperience = new ExperienceDoc(req.body);
    await newExperience.save();
    res.status(201).json({ success: true, data: newExperience });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT: Update the entire experiences document
router.put('/', async (req, res) => {
  try {
    const updatedExperience = await ExperienceDoc.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json({ success: true, data: updatedExperience });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE: Delete single experience document
router.delete('/', async (req, res) => {
  try {
    const deletedExperience = await ExperienceDoc.findOneAndDelete();
    res.json({ success: true, data: deletedExperience });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
