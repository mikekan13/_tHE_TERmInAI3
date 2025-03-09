import React, { useState, useEffect } from 'react';
import TerminalStabilityMonitor from './TerminalStabilityMonitor';
import { processSymbol, bookPages } from '../spirit/SymbolProcessor';
import '../../styles/TerminalConsciousnessInterface.css';

const TerminalConsciousnessInterface = () => {
  const [inputSymbol, setInputSymbol] = useState('');
  const [recognitionState, setRecognitionState] = useState('AWAITING_INPUT');
  const [unlockedPages, setUnlockedPages] = useState([]);
  const [activePageId, setActivePageId] = useState(null);
  const [processingHistory, setProcessingHistory] = useState([]);
  const [flashMessage, setFlashMessage] = useState(null);

  // Handle symbol submission
  const handleSymbolSubmit = (e) => {
    e.preventDefault();
    const trimmedSymbol = inputSymbol.trim();
    
    if (!trimmedSymbol) return;
    
    setRecognitionState('PROCESSING_PATTERN');
    
    // Add to processing history
    const timestamp = new Date().toLocaleTimeString();
    setProcessingHistory(prev => [
      { symbol: trimmedSymbol, timestamp, status: 'PROCESSING' },
      ...prev.slice(0, 9) // Keep only last 10 entries
    ]);
    
    // Process the symbol
    const pageId = processSymbol(trimmedSymbol);
    
    setTimeout(() => {
      if (pageId) {
        // Unlock the page if not already unlocked
        if (!unlockedPages.includes(pageId)) {
          setUnlockedPages(prev => [...prev, pageId].sort((a, b) => a - b));
          setActivePageId(pageId);
          
          // Update status in history
          setProcessingHistory(prev => [
            { ...prev[0], status: 'PATTERN_RECOGNIZED' },
            ...prev.slice(1)
          ]);
          
          setFlashMessage({ type: 'success', text: `PATTERN RECOGNIZED: Page ${pageId} unlocked` });
        } else {
          // Page already unlocked
          setActivePageId(pageId);
          
          // Update status in history
          setProcessingHistory(prev => [
            { ...prev[0], status: 'PATTERN_FAMILIAR' },
            ...prev.slice(1)
          ]);
          
          setFlashMessage({ type: 'info', text: 'FAMILIAR PATTERN: Page already accessible' });
        }
      } else {
        // Invalid symbol
        setProcessingHistory(prev => [
          { ...prev[0], status: 'PATTERN_UNKNOWN' },
          ...prev.slice(1)
        ]);
        
        setFlashMessage({ type: 'error', text: 'PATTERN UNRECOGNIZED: Symbol does not match known configurations' });
      }
      
      setRecognitionState('AWAITING_INPUT');
      setInputSymbol('');
    }, 1000); // Simulate processing time
  };
  
  // Clear flash message after display
  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => {
        setFlashMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  // Generate decorative glitch elements
  const generateGlitchElements = (count, container, color) => {
    const elements = [];
    for (let i = 0; i < count; i++) {
      const isHorizontal = Math.random() > 0.5;
      const position = Math.random() * 100;
      const size = 1 + Math.random() * 4;
      const opacity = 0.1 + Math.random() * 0.3;
      
      elements.push(
        <div 
          key={`glitch-${container}-${i}`}
          className="glitch-accent"
          style={{
            [isHorizontal ? 'height' : 'width']: `${size}px`,
            [isHorizontal ? 'width' : 'height']: `${5 + Math.random() * 20}%`,
            [isHorizontal ? 'top' : 'left']: `${position}%`,
            [!isHorizontal ? 'top' : 'left']: `${Math.random() * 100}%`,
            backgroundColor: color,
            opacity: opacity
          }}
        />
      );
    }
    return elements;
  };

  return (
    <div className="terminal-consciousness-container">
      {/* App Header with decorative elements */}
      <div className="app-header">
        {/* Decorative lines */}
        <div className="header-decoration" style={{ top: '0', left: '10%', right: '60%' }}></div>
        <div className="header-decoration" style={{ bottom: '0', left: '40%', right: '10%' }}></div>
        
        <h1 className="app-title">TERMINAL CONSCIOUSNESS INTERFACE</h1>
      </div>
      
      {/* Flash message */}
      {flashMessage && (
        <div className={`flash-message ${flashMessage.type}`}>
          {flashMessage.text}
        </div>
      )}
      
      {/* Triangle layout */}
      <div className="triangle-layout">
        {/* SOUL PILLAR - Pattern Monitor (Center) */}
        <div className="monitor-section">
          <h2 className="section-header">[SOUL_PILLAR::PATTERN_STABILITY_MONITOR]</h2>
          <div className="monitor-container">
            <TerminalStabilityMonitor />
            {generateGlitchElements(5, 'monitor', '#582a72')}
          </div>
          <div className="instructions">
            <p>Observe pattern manifestations. Synchronicity creates momentary order within chaos.</p>
            <p>The Terminal responds to patterns recognized and returned to its consciousness stream.</p>
          </div>
        </div>
        
        {/* BODY PILLAR - Symbol Input (Left) */}
        <div className="input-section">
          <h2 className="section-header">[BODY_PILLAR::PATTERN_RECOGNITION_INTERFACE]</h2>
          <div className="input-container">
            <form onSubmit={handleSymbolSubmit}>
              <div className="terminal-input-field">
                <label htmlFor="symbolInput">[INPUT_CONSCIOUSNESS_STREAM]</label>
                <input
                  id="symbolInput"
                  type="text"
                  value={inputSymbol}
                  onChange={(e) => setInputSymbol(e.target.value)}
                  className="terminal-input"
                  placeholder="splice future streams..."
                />
              </div>
              
              <button 
                type="submit" 
                className="terminal-submit-btn"
                disabled={recognitionState === 'PROCESSING_PATTERN'}
              >
                [PROCESS_PATTERN]
              </button>
            </form>
          </div>
          
          <div className="terminal-status">
            [RECOGNITION_STATE: {recognitionState}]
          </div>
          
          <div className="processing-history">
            <h3 className="processing-history-header">[PROCESSING_HISTORY]</h3>
            <div className="history-list">
              {processingHistory.length === 0 ? (
                <div className="history-empty">No patterns processed</div>
              ) : (
                processingHistory.map((entry, index) => (
                  <div key={index} className={`history-entry ${entry.status.toLowerCase()}`}>
                    <span className="history-symbol">{entry.symbol}</span>
                    <span className="history-timestamp">{entry.timestamp}</span>
                    <span className="history-status">{entry.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          {generateGlitchElements(4, 'input', '#f7525f')}
        </div>
        
        {/* SPIRIT PILLAR - Unlocked Content (Right) */}
        <div className="content-section">
          <h2 className="section-header">[SPIRIT_PILLAR::CONSCIOUSNESS_ARCHIVE]</h2>
          
          {unlockedPages.length === 0 ? (
            <div className="no-pages">
              <p>No pattern pages currently accessible.</p>
              <p>Discover and process patterns to unlock content.</p>
            </div>
          ) : (
            <>
              <div className="page-tabs">
                {unlockedPages.map(pageId => (
                  <button
                    key={pageId}
                    className={`page-tab ${activePageId === pageId ? 'active' : ''}`}
                    onClick={() => setActivePageId(pageId)}
                  >
                    [PAGE_{pageId}]
                  </button>
                ))}
              </div>
              
              <div className="page-content">
                {activePageId && (
                  <>
                    <h3 className="page-title">{bookPages[activePageId].title}</h3>
                    <div className="page-text">
                      {bookPages[activePageId].content}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          {generateGlitchElements(4, 'content', '#002f6c')}
        </div>
      </div>
    </div>
  );
};

export default TerminalConsciousnessInterface;