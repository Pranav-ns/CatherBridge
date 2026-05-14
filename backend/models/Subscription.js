const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
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
  plan: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true,
  },
  mealsPerDay: {
    type: Number,
    enum: [1, 2, 3],
    default: 1,
  },
  startDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
