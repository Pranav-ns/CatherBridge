const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route files
const authRoutes = require('./routes/auth.routes');
const catererRoutes = require('./routes/caterer.routes');
const requestRoutes = require('./routes/request.routes');
const reviewRoutes = require('./routes/review.routes');
const subscriptionRoutes = require('./routes/subscription.routes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/caterers', catererRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('CaterBridge API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
