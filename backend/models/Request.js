const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  caterer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Caterer',
    required: true,
  },
  eventDate: {
    type: Date,
    required: [true, 'Please provide an event date'],
  },
  guestCount: {
    type: Number,
    required: [true, 'Please provide the estimated number of guests'],
  },
  message: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Request', requestSchema);
