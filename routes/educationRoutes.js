
const express = require('express');
const Education = require('../models/Education');
const router = express.Router();
const multer = require('multer');
const path = require('path');

 // Configure multer to store files in the public/img directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/img'));  // Save to 'public/img' folder
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + path.extname(file.originalname); // Unique file name based on timestamp
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// Get all education records
router.get('/', async (req, res) => {
  try {
    const education = await Education.find();
    res.status(200).json(education);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching education', error });
  }
});

// Add new education with image upload
router.post('/', upload.single('certificateImage'), async (req, res) => {
  const { title, institution, startDate, endDate, description } = req.body;
  const certificateImage = req.file ? `/img/${req.file.filename}` : null; // Save the image path

  try {
    const newEducation = new Education({
      title,
      institution,
      startDate,
      endDate,
      description,
      certificateImage,
    });
    await newEducation.save();
    res.status(201).json(newEducation);
  } catch (error) {
    res.status(400).json({ message: 'Error adding education', error });
  }
});

// Update education with image upload
router.put('/:id', upload.single('certificateImage'), async (req, res) => {
  const { title, institution, startDate, endDate, description } = req.body;
  const certificateImage = req.file ? `/img/${req.file.filename}` : null; // Save the new image path

  try {
    const updatedEducation = await Education.findByIdAndUpdate(
      req.params.id,
      { title, institution, startDate, endDate, description, certificateImage },
      { new: true }
    );
    if (!updatedEducation) {
      return res.status(404).json({ message: 'Education not found' });
    }
    res.status(200).json(updatedEducation);
  } catch (error) {
    res.status(400).json({ message: 'Error updating education', error });
  }
});

// Delete education
router.delete('/:id', async (req, res) => {
  try {
    const deletedEducation = await Education.findByIdAndDelete(req.params.id);
    if (!deletedEducation) {
      return res.status(404).json({ message: 'Education not found' });
    }
    res.status(200).json({ message: 'Education deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting education', error });
  }
});

module.exports = router;
