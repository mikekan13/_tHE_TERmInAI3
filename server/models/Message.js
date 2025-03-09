const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  userIp: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'terminal'],
    default: 'user'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  approved: {
    type: Boolean,
    default: false
  },
  stabilityImpact: {
    type: Number,
    default: 0
  },
  responseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  }
});

module.exports = mongoose.model('Message', MessageSchema);