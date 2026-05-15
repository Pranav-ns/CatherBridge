const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');

// @route   GET /api/wallet
// @desc    Get wallet balance and history
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mock transaction history based on current balance
    const transactions = [];
    if (user.walletBalance > 0) {
      transactions.push({
        id: 'tx_topup_' + Date.now(),
        type: 'credit',
        amount: user.walletBalance,
        description: 'Wallet Top-up via Stripe',
        date: new Date(Date.now() - 3600000) // 1 hour ago
      });
    }

    res.json({
      balance: user.walletBalance,
      transactions: transactions
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/wallet/add
// @desc    Add funds to wallet
// @access  Private
router.post('/add', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(req.user.id);
    user.walletBalance += Number(amount);
    await user.save();

    res.json({
      message: 'Funds added successfully',
      balance: user.walletBalance
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
