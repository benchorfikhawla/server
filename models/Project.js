 
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  details: String,
  moreDetails: String,
  clientName: String,
  date: Date,
  images: [String],  // Array of image URLs
});

module.exports = mongoose.model('Project', projectSchema);
