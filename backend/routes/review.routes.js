const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Caterer = require('../models/Caterer');
const { protect } = require('../middleware/auth');

// @desc    Get reviews for a specific caterer
// @route   GET /api/reviews/:catererId
// @access  Public
router.get('/:catererId', async (req, res) => {
  try {
    const reviews = await Review.find({ caterer: req.params.catererId })
      .populate('client', 'name')
      .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private (Client only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can leave reviews' });
    }

    const { catererId, rating, comment } = req.body;

    // Check if client already reviewed this caterer
    const alreadyReviewed = await Review.findOne({
      client: req.user._id,
      caterer: catererId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this caterer' });
    }

    const review = await Review.create({
      client: req.user._id,
      caterer: catererId,
      rating: Number(rating),
      comment,
    });

    // Update Caterer average rating
    const reviews = await Review.find({ caterer: catererId });
    const numReviews = reviews.length;
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

    await Caterer.findByIdAndUpdate(catererId, {
      rating: avgRating.toFixed(1),
      numReviews,
    });

    // Populate client name for the newly created review before sending it back
    await review.populate('client', 'name');

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
