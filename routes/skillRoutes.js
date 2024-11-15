// routes/skillRoutes.js
const express = require('express');
const Skill = require('../models/Skill');
const router = express.Router();

// Get all skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills', error });
  }
});

// Add a new skill
router.post('/', async (req, res) => {
  const { name, icon, level } = req.body;

  try {
    const newSkill = new Skill({ name, icon, level });
    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(400).json({ message: 'Error adding skill', error });
  }
});

// Update a skill
router.put('/:id', async (req, res) => {
  const { name, icon, level } = req.body;

  try {
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      { name, icon, level },
      { new: true }
    );
    if (!updatedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.status(200).json(updatedSkill);
  } catch (error) {
    res.status(400).json({ message: 'Error updating skill', error });
  }
});

// Delete a skill
router.delete('/:id', async (req, res) => {
  try {
    const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
    if (!deletedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting skill', error });
  }
});

module.exports = router;
