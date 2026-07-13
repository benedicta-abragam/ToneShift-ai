const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  originalMessage: {
    type: String,
    required: true,
  },
  tone: {
    type: String,
    required: true,
  },
  rewrittenMessage: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('History', historySchema);