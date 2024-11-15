const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// MongoDB URI from .env file
const uri = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log("Connecté à MongoDB"))
  .catch((error) => {
    console.error("Erreur de connexion MongoDB:", error.message);
    process.exit(1); // Exit if connection fails
  });

// Static files
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));

// Routes
const contactRoutes = require('./routes/contactRoutes');
app.use('/api/contact', contactRoutes);

const skillRoutes = require('./routes/skillRoutes');
app.use('/api/skills', skillRoutes);

const serviceRoutes = require('./routes/serviceRoutes');
app.use('/api/services', serviceRoutes);

const educationRoutes = require('./routes/educationRoutes');
app.use('/api/education', educationRoutes);

const experienceRoutes = require('./routes/experienceRoutes');
app.use('/api/experience', experienceRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const projectsRoute = require('./routes/projectRoutes');
app.use('/api/projects', projectsRoute);

// Test route
app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend de mon portfolio');
});

// Contact form POST route with validation
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Basic email validation
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Adresse e-mail invalide.' });
  }

  if (name && email && message) {
    return res.status(200).json({ success: true, message: 'Message envoyé avec succès!' });
  } else {
    return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Le serveur écoute sur http://localhost:${port}`);
});
