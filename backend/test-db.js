require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const test = async () => {
  console.log('Connecting...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected! Querying...');
  try {
    const user = await User.findOne({});
    console.log('Query result:', user);
  } catch (err) {
    console.error('Query failed:', err);
  }
  process.exit(0);
};

test();
