// models/serviceModel.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: false, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
