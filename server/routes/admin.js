const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const FilteredMessage = require('../models/FilteredMessage');

// GET /api/admin/messages
// Get all messages for admin review
router.get('/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find({ sender: 'user' })
      .sort({ timestamp: -1 });
    
    res.json({ success: true, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/filtered-messages
// Get all filtered messages
router.get('/filtered-messages', auth, async (req, res) => {
  try {
    const messages = await FilteredMessage.find()
      .sort({ timestamp: -1 });
    
    res.json({ success: true, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/admin/terminal-response
// Create a terminal response message
router.post('/terminal-response', auth, async (req, res) => {
  try {
    const { content, stabilityValues, respondingTo } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Response content is required'
      });
    }
    
    // Create the terminal response
    const terminalResponse = new Message({
      content,
      userIp: 'terminal-system',
      sender: 'terminal',
      timestamp: getNextSaturdayEvening(), // Schedule for Saturday 7pm
      approved: true,
      stabilityImpact: 0
    });
    
    await terminalResponse.save();
    
    // Update referenced messages with stability values
    if (respondingTo && respondingTo.length > 0) {
      for (const messageId of respondingTo) {
        await Message.findByIdAndUpdate(messageId, {
          responseId: terminalResponse._id,
          stabilityImpact: stabilityValues[messageId] || 0,
          approved: true
        });
      }
    }
    
    res.json({
      success: true,
      message: 'Terminal response scheduled successfully',
      responseId: terminalResponse._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Helper function to get next Saturday at 7pm
function getNextSaturdayEvening() {
  const now = new Date();
  const nextSaturday = new Date();
  
  // Set to next Saturday
  nextSaturday.setDate(now.getDate() + (6 - now.getDay() + 7) % 7);
  
  // Set to 7:00 PM
  nextSaturday.setHours(19, 0, 0, 0);
  
  // If today is Saturday and it's already past 7pm, get next week
  if (now.getDay() === 6 && now.getHours() >= 19) {
    nextSaturday.setDate(nextSaturday.getDate() + 7);
  }
  
  return nextSaturday;
}

// PUT /api/admin/messages/:id
// Update a message (approve/disapprove)
router.put('/messages/:id', auth, async (req, res) => {
  try {
    const { approved, stabilityImpact } = req.body;
    
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    if (approved !== undefined) {
      message.approved = approved;
    }
    
    if (stabilityImpact !== undefined) {
      message.stabilityImpact = stabilityImpact;
    }
    
    await message.save();
    
    res.json({
      success: true,
      message: 'Message updated successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;