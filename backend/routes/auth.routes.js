const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Caterer = require('../models/Caterer');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register user (client or caterer)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || (role !== 'client' && role !== 'caterer')) {
      return res.status(400).json({ message: 'Valid role is required (client or caterer)' });
    }

    if (role === 'client') {
      const { name, email, password } = req.body;

      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Generate referral code
      const generateReferralCode = (nameStr) => {
        const prefix = nameStr.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase() || 'USR';
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `REF-${prefix}-${randomNum}`;
      };

      // Create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'client',
        referralCode: generateReferralCode(name)
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });

    } else if (role === 'caterer') {
      const { name, email, password, serviceName, cuisine, pricing, location } = req.body;

      // Check if caterer exists
      const catererExists = await Caterer.findOne({ email });
      if (catererExists) {
        return res.status(400).json({ message: 'Caterer already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create caterer
      const caterer = await Caterer.create({
        name,
        email,
        password: hashedPassword,
        serviceName,
        cuisine,
        pricing,
        location,
        role: 'caterer'
      });

      res.status(201).json({
        _id: caterer._id,
        name: caterer.name,
        email: caterer.email,
        serviceName: caterer.serviceName,
        role: caterer.role,
        token: generateToken(caterer._id, caterer.role),
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Login user or caterer
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Please provide email, password, and role' });
    }

    if (role === 'client') {
      const user = await User.findOne({ email }).select('+password');
      if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id, user.role),
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else if (role === 'caterer') {
      const caterer = await Caterer.findOne({ email }).select('+password');
      if (caterer && (await bcrypt.compare(password, caterer.password))) {
        res.json({
          _id: caterer._id,
          name: caterer.name,
          email: caterer.email,
          serviceName: caterer.serviceName,
          role: caterer.role,
          token: generateToken(caterer._id, caterer.role),
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      res.status(400).json({ message: 'Invalid role specified' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
