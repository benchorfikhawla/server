const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/img')); // Save uploaded images to 'public/img' folder
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname); // Generate a unique file name based on the current timestamp
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// Route to register a new user
router.post('/register', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'imageprofile', maxCount: 1 }]), async (req, res) => {
  const { name, profession, description, bio, biohome, email, tel, password } = req.body;

  if (!name || !profession || !description || !bio || !biohome || !email || !password) {
    return res.status(400).json({ message: 'All fields are required!' });
  }
   // Vérification de la validité de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Vérification du mot de passe (exemple simple : minimum 6 caractères)
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  // Handle image file paths
  const image = req.files['image'] ? `/img/${req.files['image'][0].filename}` : null;
  const imageprofile = req.files['imageprofile'] ? `/img/${req.files['imageprofile'][0].filename}` : null;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists!' });
    }

    const newUser = new User({
      name,
      profession,
      description,
      bio,
      biohome,
      image,
      imageprofile,
      email,
      tel,
      password,
    });

    // Hash password before saving user
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error, please try again later.' });
  }
});

// Route to edit user profile
// Route to edit user profile
router.put('/profile/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'imageprofile', maxCount: 1 }]), async (req, res) => {
  const { id } = req.params;  // Get user ID from the URL parameter
  const { name, profession, description, bio, biohome, email, tel, password } = req.body;

  if (!name || !profession || !description || !bio || !biohome || !email) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  // Handle image file paths if new images are uploaded
  const image = req.files['image'] ? `/img/${req.files['image'][0].filename}` : undefined;
  const imageprofile = req.files['imageprofile'] ? `/img/${req.files['imageprofile'][0].filename}` : undefined;

  try {
    const user = await User.findById(id);  // Find user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Update user fields
    user.name = name;
    user.profession = profession;
    user.description = description;
    user.bio = bio;
    user.biohome = biohome;
    user.email = email;
    user.tel = tel;

    if (image) user.image = image; // Update image if new image is uploaded
    if (imageprofile) user.imageprofile = imageprofile; // Update imageprofile if new image is uploaded

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: 'User profile updated successfully!', user });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error, please try again later.' });
  }
});


// Route to login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required!' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    // Génération du token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        name: user.name,
        email: user.email,
        profession: user.profession,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error, please try again later.' });
  }
});


// Route to get user profile by email
router.get('/profile', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required to fetch profile.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const { password, ...userProfile } = user._doc; // Omit password from the response
    return res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving user profile.' });
  }
});

// Route to retrieve all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving profiles.' });
  }
});

module.exports = router;
