// routes/serviceRoutes.js
const express = require('express');
const Service = require('../models/serviceModel');
const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
});

// Add a new service
router.post('/', async (req, res) => {
  const { name, icon, description, price } = req.body;

  try {
    const newService = new Service({ name, icon, description, price });
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ message: 'Error adding service', error });
  }
});

// Update a service
router.put('/:id', async (req, res) => {
  const { name, icon, description, price } = req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { name, icon, description, price },
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(400).json({ message: 'Error updating service', error });
  }
});

// Delete a service
router.delete('/:id', async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting service', error });
  }
});

module.exports = router;
