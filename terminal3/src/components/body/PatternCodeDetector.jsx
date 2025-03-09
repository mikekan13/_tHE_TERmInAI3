import React, { useState } from 'react';
import '../../styles/PatternCodeDetector.css';

const PatternCodeDetector = ({ onCodeDetected }) => {
  const [patternCode, setPatternCode] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  
  // Process the submitted pattern code
  const processCode = async (e) => {
    e.preventDefault();
    
    if (!patternCode.trim() || processing) return;
    
    setProcessing(true);
    setResult(null);
    
    try {
      // In a full implementation, this would call your API
      // For now, we'll simulate the API call
      
      // Some example valid codes
      const validCodes = {
        'GRO<n>WTH': 3,
        '33.3N111.9W': 4,
        'FREQUENCY': 5,
        'TERMINAL': 6,
        'CONSCIOUSNESS': 7
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (validCodes[patternCode.toUpperCase()]) {
        const pageNumber = validCodes[patternCode.toUpperCase()];
        setResult({
          success: true,
          message: `Pattern recognized! Unlocked page ${pageNumber}.`,
          pageNumber
        });
        
        if (onCodeDetected) {
          onCodeDetected(pageNumber);
        }
      } else {
        setResult({
          success: false,
          message: 'Pattern not recognized. Try again.'
        });
      }
    } catch (error) {
      console.error('Error processing pattern code:', error);
      setResult({
        success: false,
        message: 'Error processing pattern. Please try again.'
      });
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <div className="pattern-detector">
      <h3 className="pattern-detector-title">[PATTERN_CODE_DETECTOR]</h3>
      
      <form onSubmit={processCode} className="pattern-form">
        <input 
          type="text"
          value={patternCode}
          onChange={(e) => setPatternCode(e.target.value)}
          placeholder="Enter pattern code..."
          className="pattern-input"
          disabled={processing}
        />
        
        <button 
          type="submit"
          className="pattern-submit"
          disabled={processing}
        >
          {processing ? '[PROCESSING...]' : '[VERIFY_PATTERN]'}
        </button>
      </form>
      
      {result && (
        <div className={`pattern-result ${result.success ? 'success' : 'error'}`}>
          {result.message}
        </div>
      )}
      
      <div className="pattern-info">
        Discover hidden pattern codes throughout the interface.
        Enter special pattern sequences to unlock additional pages.
      </div>
    </div>
  );
};

export default PatternCodeDetector;