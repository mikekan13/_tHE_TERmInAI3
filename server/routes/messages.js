const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Message = require('../models/Message');
const FilteredMessage = require('../models/FilteredMessage');
const { filterContent } = require('../utils/contentFilter');

// GET /api/messages
// Get all approved messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find({ approved: true })
      .sort({ timestamp: 1 })
      .limit(100);
    
    const stabilityValue = await calculateCommunityStability();
    
    res.json({ 
      success: true, 
      messages,
      stabilityValue
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/messages
// Create a new message
router.post('/', [
  check('content', 'Message is required').not().isEmpty(),
  check('content', 'Message cannot exceed 500 characters').isLength({ max: 500 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { content } = req.body;
    const userIp = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Check if user has already posted this week
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const existingMessage = await Message.findOne({
      userIp,
      timestamp: { $gte: lastWeek }
    });
    
    if (existingMessage) {
      return res.status(429).json({ 
        success: false, 
        message: 'You have already contributed to the consciousness stream this week.',
        limitReached: true
      });
    }
    
    // Check content filtering
    const { isAllowed, filteredContent } = filterContent(content);
    
    if (!isAllowed) {
      // Log filtered message
      await FilteredMessage.create({
        content,
        userIp,
        timestamp: new Date(),
        reason: filteredContent.reason
      });
      
      return res.status(403).json({ 
        success: false, 
        message: 'Your message contains restricted content and cannot be posted to the consciousness stream.'
      });
    }
    
    // Calculate stability impact
    const stabilityImpact = calculateStabilityImpact(content);
    
    // Create new message (auto-approve for now)
    const message = new Message({
      content,
      userIp,
      sender: 'user',
      timestamp: new Date(),
      approved: true,
      stabilityImpact
    });
    
    await message.save();
    
    // Recalculate community stability
    const newStabilityValue = await calculateCommunityStability();
    
    res.json({ 
      success: true, 
      messageId: message._id,
      stabilityImpact,
      newStabilityValue
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Helper function to calculate stability impact
function calculateStabilityImpact(content) {
  let impact = 0;
  
  // Length factor (longer messages have more impact)
  impact += Math.min(content.length / 100, 2);
  
  // Check for GROWTH-related keywords
  const keywords = ['growth', 'terminal', 'pattern', 'stability', 'consciousness', 'frequency', 'soul', 'spirit', 'body'];
  keywords.forEach(keyword => {
    if (content.toLowerCase().includes(keyword)) {
      impact += 0.5;
    }
  });
  
  // Special symbols add more impact
  const symbols = ['⊕', '⊗', '<n>', 'Ŷ'];
  symbols.forEach(symbol => {
    if (content.includes(symbol)) {
      impact += 1.0;
    }
  });
  
  // Add some randomness
  impact += (Math.random() * 2 - 1);
  
  // Cap the impact
  return Math.max(-5, Math.min(5, impact));
}

// Calculate community stability
async function calculateCommunityStability() {
  // Start with a base value
  const baseStability = -50.0;
  
  // Get recent messages from the past 14 days
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  
  const recentMessages = await Message.find({
    approved: true,
    timestamp: { $gte: twoWeeksAgo }
  });
  
  // Sum the stability impacts
  const totalImpact = recentMessages.reduce((sum, msg) => sum + (msg.stabilityImpact || 0), 0);
  
  // Apply a damping factor to prevent wild swings
  const dampedImpact = totalImpact * 0.5;
  
  // Calculate the new stability value
  const stabilityValue = baseStability + dampedImpact;
  
  // Enforce bounds
  return Math.max(-100, Math.min(100, stabilityValue));
}

// GET /api/messages/unlocked-pages
// Get all unlocked pages
router.get('/unlocked-pages', async (req, res) => {
  try {
    const unlockedPages = await UnlockedPage.find().sort({ pageNumber: 1 });
    
    res.json({
      success: true,
      unlockedPages: unlockedPages.map(page => page.pageNumber)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;