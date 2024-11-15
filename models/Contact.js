const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          // This regex checks if the email follows a valid email format
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      }
    },
    message: {
      type: String,
      required: true,
    },
    tel: {
      type: String,
      required: false,
      validate: {
        validator: function(v) {
          return /^\+?[1-9]\d{9,14}$/.test(v); 
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    subject: {
      type: String,
      required: false, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
