const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// 1. Schema Definition
const ContactSchema = new mongoose.Schema({
  emailContact: { type: String, required: true },
  locationContact: { type: String, required: true },
  contactDisc: { type: String, required: true }
});

const Contact = mongoose.model('Contact', ContactSchema);

// GET: Fetch contact section texts
router.get('/', async (req, res) => {
  try {
    let contactData = await Contact.findOne();
    if (!contactData) {
      contactData = new Contact({
        emailContact: "admin@example.com",
        locationContact: "City, Country",
        contactDisc: "Get in touch with me."
      });
      await contactData.save();
    }
    res.json({ success: true, data: contactData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT: Update contact section texts
router.put('/', async (req, res) => {
  try {
    let contactData = await Contact.findOne();
    if (!contactData) {
      contactData = new Contact(req.body);
    } else {
      contactData.emailContact = req.body.emailContact || contactData.emailContact;
      contactData.locationContact = req.body.locationContact || contactData.locationContact;
      contactData.contactDisc = req.body.contactDisc || contactData.contactDisc;
    }
    await contactData.save();
    res.json({ success: true, data: contactData });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
//POST: Create a new contact
router.post('/', async (req, res) => {
  try {
    const contactData = new Contact(req.body);
    await contactData.save();
    res.json({ success: true, data: contactData });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
//DELETE: Delete contact
router.delete('/', async (req, res) => {
  try {
    const contactData = await Contact.findByIdAndDelete(req.params.id);
    if (!contactData) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }
    res.json({ success: true, data: contactData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// Export Router
module.exports = router;
