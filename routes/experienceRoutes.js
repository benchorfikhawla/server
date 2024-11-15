const express = require('express');
const Experience = require('../models/Experience');
const router = express.Router();

// Get all experience records
router.get('/', async (req, res) => {
  try {
    const experience = await Experience.find();
    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experience', error });
  }
});

// Add new experience
router.post('/', async (req, res) => {
  const { title, company, startDate, endDate, description } = req.body;

  try {
    const newExperience = new Experience({
      title,
      company,
      startDate,
      endDate,
      description,
    });
    await newExperience.save();
    res.status(201).json(newExperience);
  } catch (error) {
    res.status(400).json({ message: 'Error adding experience', error });
  }
});

// Update experience
router.put('/:id', async (req, res) => {
  const { title, company, startDate, endDate, description } = req.body;

  try {
    const updatedExperience = await Experience.findByIdAndUpdate(
      req.params.id,
      { title, company, startDate, endDate, description },
      { new: true }
    );
    if (!updatedExperience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(200).json(updatedExperience);
  } catch (error) {
    res.status(400).json({ message: 'Error updating experience', error });
  }
});

// Delete experience
router.delete('/:id', async (req, res) => {
  try {
    const deletedExperience = await Experience.findByIdAndDelete(req.params.id);
    if (!deletedExperience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting experience', error });
  }
});

module.exports = router;