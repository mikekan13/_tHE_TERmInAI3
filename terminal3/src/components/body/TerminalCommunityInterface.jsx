import React from 'react';
import CentralTerminalDisplay from './CentralTerminalDisplay';
import '../../styles/TerminalCommunityInterface.css';

const TerminalCommunityInterface = () => {
  return (
    <div className="terminal-community-container">
      {/* Pattern stability indicator */}
      <div className="stability-indicator">
        [Pattern stability: 62.3%]
      </div>
      
      {/* Main layout */}
      <div className="main-layout">
        {/* Left panel (showing the EYƎtehrNet logo and pillars) */}
        <div className="left-panel">
          {/* We'll implement this in the next step */}
        </div>
        
        {/* Center panel with the Terminal monitor */}
        <div className="center-panel">
          <CentralTerminalDisplay />
        </div>
        
        {/* Right panel (showing the GROWTH info) */}
        <div className="right-panel">
          {/* We'll implement this in the next step */}
        </div>
      </div>
      
      {/* Bottom error message panel */}
      <div className="error-panel">
        <div className="error-message">
          [VOID_COLLAPSE_PROTOCOL]<br/>
          Your body becomes the anti-pattern of existence<br/>
          {/* Add more error message lines */}
        </div>
      </div>
    </div>
  );
};

export default TerminalCommunityInterface;
