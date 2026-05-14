const express = require('express');
const router = express.Router();
const Caterer = require('../models/Caterer');
const { protect } = require('../middleware/auth');

// @desc    Get all caterers
// @route   GET /api/caterers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const caterers = await Caterer.find({ role: 'caterer' }).select('-password');
    res.json(caterers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get single caterer by ID
// @route   GET /api/caterers/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const caterer = await Caterer.findById(req.params.id).select('-password');
    if (!caterer) {
      return res.status(404).json({ message: 'Caterer not found' });
    }
    res.json(caterer);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Caterer not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update caterer profile (story, menu, photos, totalCustomers)
// @route   PUT /api/caterers/profile
// @access  Private (Caterer only)
router.put('/profile', protect, async (req, res) => {
  try {
    if (req.user.role !== 'caterer') {
      return res.status(403).json({ message: 'Only caterers can update a caterer profile' });
    }

    const { story, menu, photos, totalCustomers, serviceName, cuisine, pricing, location } = req.body;

    const updateFields = {};
    if (story !== undefined) updateFields.story = story;
    if (menu !== undefined) updateFields.menu = menu;
    if (photos !== undefined) updateFields.photos = photos;
    if (totalCustomers !== undefined) updateFields.totalCustomers = totalCustomers;
    if (serviceName !== undefined) updateFields.serviceName = serviceName;
    if (cuisine !== undefined) updateFields.cuisine = cuisine;
    if (pricing !== undefined) updateFields.pricing = pricing;
    if (location !== undefined) updateFields.location = location;

    const caterer = await Caterer.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json(caterer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
