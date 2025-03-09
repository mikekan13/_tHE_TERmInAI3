const mongoose = require('mongoose');

const FilteredMessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  userIp: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  reason: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('FilteredMessage', FilteredMessageSchema);