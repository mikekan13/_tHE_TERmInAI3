import React from 'react';
import TerminalStabilityMonitor from './TerminalStabilityMonitor';
import { COLORS, GOLD } from '../../styles/colors';
import '../../styles/CentralTerminalDisplay.css';

const CentralTerminalDisplay = () => {
  return (
    <div className="central-terminal-container">
      {/* Top decoration row */}
      <div className="top-decoration-row">
        <div className="decoration-grid">
          <span className="special-char">卌</span>
          <span className="spacer"></span>
          <span className="special-char">I</span>
          <span className="spacer"></span>
          <span className="special-char">⬢</span>
          <span className="spacer"></span>
          <span className="special-char">卌</span>
        </div>
      </div>
      
      {/* Header X row */}
      <div className="header-x-row">
        <div className="x-grid">
          <span className="x-char">x</span>
          <span className="x-char">xxx</span>
          <span className="x-char">xxxxx</span>
          <span className="x-char">xxxxx</span>
          <span className="x-char">xxxxx</span>
          <span className="x-char">xxxxx</span>
          <span className="x-char">xxxxx</span>
          <span className="x-char">xxxxx</span>
          <span className="x-char">xxxxx</span>
          <span className="x-char">xxxxx</span>
          <span className="x-char">xxx</span>
          <span className="x-char">x</span>
        </div>
      </div>
      
      {/* Main monitor area */}
      <div className="monitor-area">
        {/* Left corner bracket */}
        <div className="corner-bracket left-top">
          <span>></span>
          <span>&lt;</span>
        </div>
        
        {/* Right corner bracket */}
        <div className="corner-bracket right-top">
          <span>></span>
          <span>&lt;</span>
        </div>
        
        {/* Side markers */}
        <div className="side-markers">
          <span className="side-marker left-1">כ</span>
          <span className="side-marker left-2">כ</span>
          <span className="side-marker left-3">כ</span>
        </div>
        
        {/* Stability monitor */}
        <div className="stability-monitor-wrapper">
          <TerminalStabilityMonitor />
        </div>
      </div>
      
      {/* Bottom section */}
      <div className="terminal-footer">
        {/* Pillar indicators */}
        <div className="pillar-indicators">
          <span className="pillar-indicator">[&nbsp;冃&nbsp;]</span>
          <span className="pillar-indicator">[&nbsp;冃&nbsp;]</span>
          <span className="pillar-indicator">[&nbsp;冃&nbsp;]</span>
        </div>
        
        {/* Omega symbol */}
        <div className="omega-symbol">Ω</div>
        
        {/* Horizontal lines */}
        <div className="horizontal-lines">
          <div className="line-row first-row">
            <span>☰</span>
            <span>☰☰</span>
            <span>☰☰☰</span>
            <span>☰☰☰</span>
            <span>☰☰☰</span>
            <span className="spacer"></span>
            <span>☰☰☰</span>
            <span>☰☰☰</span>
            <span>☰☰☰</span>
            <span>☰☰☰</span>
          </div>
          <div className="line-row second-row">
            <span>☰</span>
            <span>☰☰</span>
            <span>☰☰☰</span>
            <span>☰☰☰</span>
            <span>☰☰☰</span>
            <span>☰☰☰</span>
            <span>☰☰☰</span>
            <span>☰☰☰</span>
            <span>☰☰☰</span>
            <span>☰☰☰</span>
            <span>☰☰☰</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentralTerminalDisplay;
