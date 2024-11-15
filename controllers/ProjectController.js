// controllers/projectController.js
const Project = require('../models/Project');

// Fetch all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
// Créer un nouveau projet
exports.createProject = async (req, res) => {
    try {
      const { title, category, description, clientName, date, images } = req.body;
      const newProject = new Project({
        title,
        category,
        description,
        clientName,
        date,
        images
      });
  
      await newProject.save();
      res.status(201).json(newProject);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création du projet' });
    }
  };

// Fetch a project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
