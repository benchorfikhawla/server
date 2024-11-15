const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profession: { type: String, required: true },
  bio: { type: String, required: true },
  biohome: { type: String, required: true },
  image: { type: String, required: true }, // URL or path to image
  imageprofile: { type: String, required: true }, // URL or path to profile image
  description: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
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
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum length of 6 characters for the password
  },
});

// Pre-save hook to hash the password before saving it to the database
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash password
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords during login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password); // Compare hashed password
    return isMatch;
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
