const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const { protect } = require('../middleware/auth');

// @desc    Create a new catering request
// @route   POST /api/requests
// @access  Private (Client only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can create requests' });
    }

    const { catererId, eventDate, guestCount, message } = req.body;

    if (!catererId || !eventDate || !guestCount) {
      return res.status(400).json({ message: 'Please provide caterer, event date, and guest count' });
    }

    const request = await Request.create({
      client: req.user._id,
      caterer: catererId,
      eventDate,
      guestCount,
      message,
    });

    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get all requests for logged in user (client or caterer)
// @route   GET /api/requests
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let requests;
    if (req.user.role === 'client') {
      // Find requests made by this client, populate the caterer details
      requests = await Request.find({ client: req.user._id })
        .populate('caterer', 'name serviceName email location')
        .sort('-createdAt');
    } else if (req.user.role === 'caterer') {
      // Find requests sent to this caterer, populate client details
      requests = await Request.find({ caterer: req.user._id })
        .populate('client', 'name email')
        .sort('-createdAt');
    }

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update request status
// @route   PUT /api/requests/:id/status
// @access  Private (Caterer only)
router.put('/:id/status', protect, async (req, res) => {
  try {
    if (req.user.role !== 'caterer') {
      return res.status(403).json({ message: 'Only caterers can update status' });
    }

    const { status } = req.body;
    if (!['pending', 'accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Ensure the request belongs to the logged-in caterer
    if (request.caterer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this request' });
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
