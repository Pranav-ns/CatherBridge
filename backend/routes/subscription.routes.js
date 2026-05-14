const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const { protect } = require('../middleware/auth');

// @desc    Create subscription (Tiffin service)
// @route   POST /api/subscriptions
// @access  Private (Customer only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only customers can subscribe' });
    }

    const { catererId, plan, mealsPerDay, startDate } = req.body;

    const existing = await Subscription.findOne({
      client: req.user._id,
      caterer: catererId,
      status: 'active',
    });

    if (existing) {
      return res.status(400).json({ message: 'You already have an active subscription with this caterer' });
    }

    const subscription = await Subscription.create({
      client: req.user._id,
      caterer: catererId,
      plan,
      mealsPerDay,
      startDate,
    });

    await subscription.populate('caterer', 'serviceName cuisine location');
    res.status(201).json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get my subscriptions
// @route   GET /api/subscriptions
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ client: req.user._id })
      .populate('caterer', 'serviceName cuisine location photos')
      .sort('-createdAt');
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update subscription status (pause/cancel)
// @route   PUT /api/subscriptions/:id/status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

    if (subscription.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    subscription.status = req.body.status;
    await subscription.save();
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
