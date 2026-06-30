const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// 1. Schema Definition
const SingleProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  badge: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: String, required: true },
  imageUrl: { type: String }
});

const ProjectsDocSchema = new mongoose.Schema({
  projectsList: [SingleProjectSchema]
});

const ProjectsDoc = mongoose.model('ProjectsDoc', ProjectsDocSchema);



// GET: Retrieve the single projects document containing the list
router.get('/', async (req, res) => {
  try {
    let projectsDoc = await ProjectsDoc.findOne();
    if (!projectsDoc) {
      projectsDoc = new ProjectsDoc({
        projectsList: [
          {
            title: "Nova Crypt Dashboard",
            badge: "Featured Web App",
            description: "A premium responsive cryptocurrency analytics tracker.",
            tags: "React, Tailwind, ChartJS",
            imageUrl: ""
          }
        ]
      });
      await projectsDoc.save();
    }
    res.json({ success: true, data: projectsDoc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT: Update the entire projects document
router.put('/', async (req, res) => {
  try {
    const updatedDoc = await ProjectsDoc.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json({ success: true, data: updatedDoc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 4. Export Router
module.exports = router;
