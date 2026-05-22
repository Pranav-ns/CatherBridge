const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Toggle favorite caterer
// @route   POST /api/users/favorites/:catererId
// @access  Private (Client only)
router.post('/favorites/:catererId', protect, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can have favorites' });
    }

    const { catererId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFavorite = user.favorites.includes(catererId);

    if (isFavorite) {
      // Remove from favorites
      user.favorites = user.favorites.filter(id => id.toString() !== catererId);
    } else {
      // Add to favorites
      user.favorites.push(catererId);
    }

    await user.save();
    res.json({ favorites: user.favorites });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get user's favorites with caterer details
// @route   GET /api/users/favorites
// @access  Private (Client only)
router.get('/favorites', protect, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can have favorites' });
    }

    const user = await User.findById(req.user.id).populate('favorites');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.favorites);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get user referral code
// @route   GET /api/users/referral
// @access  Private (Client only)
router.get('/referral', protect, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients have referral codes' });
    }

    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate code if they don't have one (for existing users before this feature)
    if (!user.referralCode) {
      const prefix = user.name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase() || 'USR';
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      user.referralCode = `REF-${prefix}-${randomNum}`;
      await user.save();
    }

    res.json({ referralCode: user.referralCode });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get raw user favorites list (just IDs)
// @route   GET /api/users/favorites/ids
// @access  Private (Client only)
router.get('/favorites/ids', protect, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can have favorites' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.favorites);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
