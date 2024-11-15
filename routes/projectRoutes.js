const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Project = require('../models/Project');

// Configuration de multer pour le stockage des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/img/projects'));  // Dossier où les images seront stockées
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname); // Générer un nom de fichier unique
    cb(null, fileName);
  },
});


const upload = multer({ storage });

// Route pour obtenir tous les projets
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ date: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir un projet par ID et les projets adjacents
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const projects = await Project.find().sort({ date: -1 });
    const currentProjectIndex = projects.findIndex((project) => project._id.toString() === id);

    if (currentProjectIndex === -1) return res.status(404).json({ error: 'Projet non trouvé' });

    const previousProject = projects[currentProjectIndex - 1] || null;
    const nextProject = projects[currentProjectIndex + 1] || null;

    const project = projects[currentProjectIndex];
    res.json({
      project,
      previousProjectId: previousProject ? previousProject._id : null,
      nextProjectId: nextProject ? nextProject._id : null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du projet' });
  }
});

// Route to create a new project with images
router.post('/', upload.array('images', 5), async (req, res) => {
  const { title, category, description, clientName, date, details, moreDetails } = req.body;
  
  // Create an array of image URLs
  const images = req.files ? req.files.map(file => `/img/projects/${file.filename}`) : [];

  try {
    const newProject = new Project({
      title,
      category,
      description,
      clientName,
      date,
      details,
      moreDetails,
      images,  // Add images array to the new project
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Error creating project' });
  }
});


// Route pour mettre à jour un projet par ID
// Update a project by ID
router.put('/:id', upload.array('images', 5), async (req, res) => {
  const { id } = req.params;
  const { title, category, description, clientName, date, details, moreDetails } = req.body;

  try {
    // Get current project to preserve existing images if none are uploaded
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: 'Projet non trouvé' });

    // If no new images, retain current images
    const images = req.files && req.files.length > 0
      ? req.files.map(file => `/img/projects/${file.filename}`)
      : project.images;  // Retain existing images if no new ones are uploaded

    // Update the project with new fields or retain existing images if no updates
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { title, category, description, clientName, date, images, details, moreDetails },
      { new: true }
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du projet' });
  }
});


// Route pour supprimer un projet par ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) return res.status(404).json({ error: 'Projet non trouvé' });

    res.status(200).json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du projet' });
  }
});

module.exports = router;
