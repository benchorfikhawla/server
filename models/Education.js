const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    institution: { type: String, required: true },
    startDate: { type: String, required: false },
    endDate: { type: String, required: false },
    description: { type: String, required: true },
    certificateImage: { type: String, required: true }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Education', educationSchema);