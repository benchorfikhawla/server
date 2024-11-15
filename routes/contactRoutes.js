const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');  // Mongoose model pour les messages de contact

// Route pour enregistrer un message de contact dans la base de données
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  // Créer un nouveau message de contact dans MongoDB
  const newContact = new Contact({
    name,
    email,
    message,
  });

  try {
    // Sauvegarder le message dans MongoDB
    await newContact.save();
    res.status(200).json({ message: 'Message saved successfully!' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Error saving message', error });
  }
});

module.exports = router;
