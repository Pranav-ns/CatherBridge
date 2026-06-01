const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Load custom middlewares
const metricsMiddleware = require('./middleware/metrics.middleware');
const errorMiddleware = require('./middleware/error.middleware');
const { register } = require('./utils/metrics');

const app = express();

// Middleware
app.use(metricsMiddleware);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// Route files
const authRoutes = require('./routes/auth.routes');
const catererRoutes = require('./routes/caterer.routes');
const requestRoutes = require('./routes/request.routes');
const reviewRoutes = require('./routes/review.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const paymentRoutes = require('./routes/payment.routes');
const walletRoutes = require('./routes/wallet.routes');
const chatRoutes = require('./routes/chat.routes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/caterers', catererRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/chat', chatRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('CaterBridge API is running...');
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  const metrics = await register.metrics();
  res.send(metrics);
});

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5007;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
