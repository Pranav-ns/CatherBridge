const express = require('express');
const router = express.Router();
const { processChat } = require('../controllers/chat.controller');
// We don't strictly require auth for the general FAQ bot, but you can add the protect middleware if needed
// const { protect } = require('../middleware/auth.middleware');

router.post('/', processChat);

module.exports = router;
