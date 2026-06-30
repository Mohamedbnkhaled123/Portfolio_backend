const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// 1. Schema Definition
const SkillSchema = new mongoose.Schema({
  mySkills: { type: String, required: true },
  toolsTitle: { type: String, required: true },
  toolDetails: { type: String, required: true }
});

const Skill = mongoose.model('Skill', SkillSchema);

// GET: Retrieve the skills document (single doc consistency)
router.get('/', async (req, res) => {
  try {
    let skillData = await Skill.findOne();
    if (!skillData) {
      skillData = new Skill({
        mySkills: "Web Technologies",
        toolsTitle: "Node.js & Express",
        toolDetails: "Proficient in building fast, scalable backend APIs and integrating with MongoDB."
      });
      await skillData.save();
    }
    res.json({ success: true, data: skillData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST: Add a new skill
router.post('/', async (req, res) => {
  try {
    const newSkill = new Skill(req.body);
    await newSkill.save();
    res.status(201).json({ success: true, data: newSkill });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT: Update the skills document
// PUT: Update the skills document
router.put('/', async (req, res) => {
  try {
    const skillData = await Skill.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json({ success: true, data: skillData });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});


// DELETE: Delete a skill by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
    if (!deletedSkill) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }
    res.json({ success: true, message: 'Skill deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
