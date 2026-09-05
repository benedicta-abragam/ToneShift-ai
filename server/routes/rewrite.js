const express = require('express');
const router = express.Router();
const rewriteMessage = require('../utils/geminiService');
const History = require('../models/History');

router.post('/', async (req, res) => {
  console.log('[rewrite route] incoming body:', req.body);
  const { message, tone } = req.body;

  if (!message || !message.trim() || !tone) {
    console.log('[rewrite route] validation failed - message or tone missing');
    return res.status(400).json({ error: 'Message and tone are required' });
  }

  let rewrittenMessage;
  try {
    console.log('[rewrite route] calling rewriteMessage()');
    rewrittenMessage = await rewriteMessage(message, tone);
    console.log('[rewrite route] rewriteMessage() succeeded');
  } catch (err) {
    console.error('[rewrite route] Rewrite failed:', err.message);
    return res.status(502).json({ error: err.message || 'Failed to generate the rewrite' });
  }

  // Respond with the rewrite immediately; history is best-effort and must not
  // block or fail a request that already has a successful AI response.
  res.json({ rewrittenMessage });

  try {
    await new History({
      originalMessage: message,
      tone,
      rewrittenMessage,
    }).save();
    console.log('[rewrite route] history saved to MongoDB');
  } catch (err) {
    console.error('[rewrite route] Failed to save history entry:', err.message);
  }
});

module.exports = router;