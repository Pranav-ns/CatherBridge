const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: String, required: true },
});

const catererSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  serviceName: {
    type: String,
    required: [true, 'Please add a catering service name'],
  },
  cuisine: {
    type: String,
    required: [true, 'Please specify the main cuisine(s)'],
  },
  pricing: {
    type: String,
    required: [true, 'Please add pricing details (e.g., $$$, $50/person)'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location or service area'],
  },
  story: {
    type: String,
    default: '',
  },
  photos: {
    type: [String],
    default: [],
  },
  menu: {
    type: [menuItemSchema],
    default: [],
  },
  totalCustomers: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    enum: ['caterer'],
    default: 'caterer',
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Caterer', catererSchema);
