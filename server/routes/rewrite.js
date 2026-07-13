const express = require('express');
const router = express.Router();
const rewriteMessage = require('../utils/geminiService');
const History = require('../models/History');

router.post('/', async (req, res) => {
  try {
    const { message, tone } = req.body;

    if (!message || !tone) {
      return res.status(400).json({ error: 'Message and tone are required' });
    }

    const rewrittenMessage = await rewriteMessage(message, tone);

    const historyEntry = new History({
      originalMessage: message,
      tone: tone,
      rewrittenMessage: rewrittenMessage,
    });
    await historyEntry.save();

    res.json({ rewrittenMessage });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;