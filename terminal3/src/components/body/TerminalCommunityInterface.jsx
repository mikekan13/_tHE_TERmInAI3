import React, { useState, useEffect, useRef } from 'react';
import { COLORS, GOLD } from '../../styles/colors';
import CommunityStabilityMonitor from './CommunityStabilityMonitor';
import HiddenClues from './HiddenClues';
import BookPagesDisplay from './BookPagesDisplay';
import PatternCodeDetector from './PatternCodeDetector';
import '../../styles/TerminalCommunityInterface.css';

const TerminalCommunityInterface = () => {
  // State management
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      content: "The Terminal awaits your contribution to the consciousness stream.",
      sender: 'terminal',
      timestamp: new Date(Date.now() - 86400000).toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [timeUntilResponse, setTimeUntilResponse] = useState('');
  const [canSubmit, setCanSubmit] = useState(true);
  const [stabilityValue, setStabilityValue] = useState(-50.0);
  const [unlockedPages, setUnlockedPages] = useState([1]); // Start with first page unlocked
  const messagesEndRef = useRef(null);
  
  // Calculate time until next Terminal response
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nextSaturday = new Date();
      nextSaturday.setDate(now.getDate() + (6 - now.getDay()));
      nextSaturday.setHours(19, 0, 0, 0);
      
      if (now > nextSaturday) {
        nextSaturday.setDate(nextSaturday.getDate() + 7);
      }
      
      const diff = nextSaturday - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeUntilResponse(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      
      // Disable submissions 2 hours before response time
      const twoHoursBeforeResponse = diff <= (1000 * 60 * 60 * 2);
      setCanSubmit(!twoHoursBeforeResponse);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Fetch messages and unlocked pages from API (simulated)
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log('Fetching messages...');
        // Uncomment and implement actual API call when ready.
        /*
        const response = await fetch('/api/messages');
        const data = await response.json();
        if (data.success) {
          setMessages(data.messages);
          if (data.stabilityValue !== undefined) {
            setStabilityValue(data.stabilityValue);
          }
        }
        */
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    
    const fetchUnlockedPages = async () => {
      try {
        console.log('Fetching unlocked pages...');
        // Uncomment and implement actual API call when ready.
        /*
        const response = await fetch('/api/messages/unlocked-pages');
        const data = await response.json();
        if (data.success) {
          setUnlockedPages(data.unlockedPages);
        }
        */
      } catch (error) {
        console.error('Error fetching unlocked pages:', error);
      }
    };
    
    fetchMessages();
    fetchUnlockedPages();
    
    const interval = setInterval(() => {
      fetchMessages();
      fetchUnlockedPages();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Submit message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !canSubmit) return;
    
    try {
      const newMessage = {
        id: Date.now(),
        content: inputMessage,
        sender: 'user',
        timestamp: new Date().toISOString(),
        stabilityImpact: (Math.random() * 10) - 5 // Random impact between -5 and 5
      };
      
      // Use functional update to avoid stale state
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputMessage('');
      
      // Update stability value
      setStabilityValue(prev => {
        const newValue = prev + newMessage.stabilityImpact;
        return Math.max(-100, Math.min(100, newValue));
      });
      
      // Simulate hitting rate limit after submission
      setCanSubmit(false);
      
      // Uncomment and implement actual API call when ready.
      /*
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: inputMessage }),
      });
      const result = await response.json();
      if (result.success) {
        const newMessage = {
          id: result.messageId,
          content: inputMessage,
          sender: 'user',
          timestamp: new Date().toISOString(),
          stabilityImpact: result.stabilityImpact || 0
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setInputMessage('');
        if (result.newStabilityValue !== undefined) {
          setStabilityValue(result.newStabilityValue);
        }
        setCanSubmit(!result.limitReached);
      } else {
        alert(result.message || 'Failed to send message.');
      }
      */
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('An error occurred while sending your message.');
    }
  };
  
  // Handle pattern code detection
  const handleCodeDetected = (pageNumber) => {
    if (!unlockedPages.includes(pageNumber)) {
      setUnlockedPages(prevPages => [...prevPages, pageNumber].sort((a, b) => a - b));
      
      // Increase stability when a page is unlocked
      setStabilityValue(prev => Math.min(100, prev + 10));
      
      const unlockMessage = {
        id: Date.now(),
        content: `[PATTERN_RECOGNIZED] Page ${pageNumber} of the GROWTH documentation has been unlocked. Congratulations on your pattern recognition abilities.`,
        sender: 'terminal',
        timestamp: new Date().toISOString()
      };
      
      // Use functional update to safely add the new terminal message
      setMessages(prevMessages => [...prevMessages, unlockMessage]);
    }
  };
  
  return (
    <div className="terminal-community-container">
      <div className="interface-header">
        <div className="terminal-status-bar">
          <span className="status-item">[PATTERN_STABILITY: {stabilityValue.toFixed(1)}%]</span>
          <span className="status-item">[NEXT_CONSCIOUSNESS_STREAM: {timeUntilResponse}]</span>
        </div>
        <h1 className="terminal-title">
          <span className="terminal-glyph">⊗</span> THE TERMINAL CONSCIOUSNESS INTERFACE <span className="terminal-glyph">⊕</span>
        </h1>
      </div>
      
      <div className="interface-grid">
        <div className="monitor-section">
          <h2 className="section-header">[SOUL_PILLAR::PATTERN_STABILITY_MONITOR]</h2>
          <div className="monitor-container">
            <CommunityStabilityMonitor 
              stabilityValue={stabilityValue} 
              hasHiddenClue={Math.abs(stabilityValue) > 60}
            />
            <HiddenClues stabilityValue={stabilityValue} />
          </div>
        </div>
        
        <div className="messages-section">
          <h2 className="section-header">[CONSCIOUSNESS_STREAM_ARCHIVE]</h2>
          <div className="messages-container">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'terminal' ? 'terminal-message' : 'user-message'}`}
              >
                <div className="message-header">
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleString()}
                  </span>
                  <span className="message-sender">
                    [{message.sender === 'terminal' ? 'TERMINAL' : 'ENTITY'}]
                  </span>
                </div>
                <div className="message-content">{message.content}</div>
                {message.stabilityImpact !== undefined && (
                  <div className={`stability-impact ${message.stabilityImpact > 0 ? 'positive' : 'negative'}`}>
                    [STABILITY_IMPACT: {message.stabilityImpact > 0 ? '+' : ''}{message.stabilityImpact.toFixed(1)}%]
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="input-container">
            <div className={`input-status ${canSubmit ? 'open' : 'closed'}`}>
              {canSubmit 
                ? '[CONSCIOUSNESS_STREAM_OPEN]' 
                : '[CONSCIOUSNESS_STREAM_CLOSED_FOR_PROCESSING]'}
            </div>
            <form onSubmit={handleSubmit} className="input-form">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="terminal-input"
                placeholder="Enter your message..."
                disabled={!canSubmit}
                maxLength={500}
              />
              <button 
                type="submit" 
                className="terminal-submit-btn"
                disabled={!canSubmit}
              >
                [TRANSMIT]
              </button>
            </form>
            <div className="input-hint">
              One message per entity per week. Choose wisely.
            </div>
          </div>
        </div>
      </div>
      
      <div className="sidebar-components">
        <BookPagesDisplay unlockedPages={unlockedPages} />
        <PatternCodeDetector onCodeDetected={handleCodeDetected} />
      </div>
    </div>
  );
};

export default TerminalCommunityInterface;