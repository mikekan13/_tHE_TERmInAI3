const mongoose = require('mongoose');

const UnlockedPageSchema = new mongoose.Schema({
  pageNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 13
  },
  unlockedAt: {
    type: Date,
    default: Date.now
  },
  unlockedBy: {
    type: String,
    default: 'community'
  }
});

module.exports = mongoose.model('UnlockedPage', UnlockedPageSchema);