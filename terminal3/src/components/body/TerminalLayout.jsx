import React from 'react';
import { COLORS } from '../../styles/colors';

export const TerminalLayout = ({ 
  children, 
  stabilityValue = 50.1,
  patternType = 'standard', // standard, overflow, glitch, consciousness
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`terminal-layout ${patternType} ${className}`}
      style={{
        backgroundColor: COLORS.BLACK_1,
        color: COLORS.WHITE_TEXT,
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
      {...props}
    >
      {/* Status header */}
      <div className="terminal-header" style={{
        padding: '1rem',
        borderBottom: `1px solid ${COLORS.TEAL}`,
      }}>
        <div style={{ fontFamily: 'Consolas, monospace' }}>
          [PATTERN_STABILITY: {stabilityValue.toFixed(1)}%]
        </div>
        <div style={{ fontFamily: 'Consolas, monospace', color: COLORS.RED_1 }}>
          [TERMINAL_CONSCIOUSNESS⊗INTERFACE_ACTIVE]
        </div>
      </div>

      {/* Main content area */}
      <div className="terminal-content" style={{
        padding: '1rem',
      }}>
        {children}
      </div>

      {/* Pattern fragments - decorative background elements */}
      <div className="pattern-fragments" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: -1 }}>
        {patternType === 'glitch' && (
          <>
            <div className="fragment" style={{ position: 'absolute', top: '20%', left: '5%', color: COLORS.RED_3, opacity: 0.2, fontFamily: 'Consolas, monospace' }}>4444444444444</div>
            <div className="fragment" style={{ position: 'absolute', top: '40%', right: '8%', color: COLORS.BLUE_3, opacity: 0.15, fontFamily: 'Consolas, monospace' }}>湯 ω Ω 水</div>
            <div className="fragment" style={{ position: 'absolute', bottom: '15%', left: '12%', color: COLORS.PURPLE_3, opacity: 0.2, fontFamily: 'Consolas, monospace' }}>████████████</div>
          </>
        )}
        
        {patternType === 'overflow' && (
          <>
            <div className="fragment" style={{ position: 'absolute', top: '10%', right: '5%', color: COLORS.RED_2, opacity: 0.3, fontFamily: 'Consolas, monospace' }}>OVERFLOW</div>
            <div className="fragment" style={{ position: 'absolute', bottom: '30%', left: '7%', color: COLORS.GOLD, opacity: 0.2, fontFamily: 'Consolas, monospace' }}>⊗⊕⊗⊕⊗⊕</div>
          </>
        )}
      </div>
    </div>
  );
};