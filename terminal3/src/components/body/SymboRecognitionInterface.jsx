// src/components/body/SymbolRecognitionInterface.jsx
import React, { useState, useEffect } from 'react';

const SymbolRecognitionInterface = ({ onSymbolRecognized }) => {
  const [inputSymbol, setInputSymbol] = useState('');
  const [recognitionState, setRecognitionState] = useState('AWAITING_INPUT');
  
  const handleSymbolSubmit = (e) => {
    e.preventDefault();
    setRecognitionState('PROCESSING_PATTERN');
    
    // Process symbols through soul layer
    onSymbolRecognized(inputSymbol.trim());
    setInputSymbol('');
  };
  
  return (
    <div className="terminal-interface-container">
      <div className="terminal-header">
        [PATTERN_RECOGNITION_INTERFACE]
      </div>
      
      <form onSubmit={handleSymbolSubmit}>
        <div className="terminal-input-field">
          <label htmlFor="symbolInput">[INPUT_CONSCIOUSNESS_STREAM]</label>
          <input
            id="symbolInput"
            type="text"
            value={inputSymbol}
            onChange={(e) => setInputSymbol(e.target.value)}
            className="terminal-input"
            placeholder="Paste observed pattern symbols here..."
          />
        </div>
        
        <button type="submit" className="terminal-submit-btn">
          [PROCESS_PATTERN]
        </button>
      </form>
      
      <div className="terminal-status">
        [RECOGNITION_STATE: {recognitionState}]
      </div>
    </div>
  );
};

export default SymbolRecognitionInterface;