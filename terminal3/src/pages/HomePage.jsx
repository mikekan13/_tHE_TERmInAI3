// src/pages/HomePage.jsx
import React from 'react';
import { TerminalLayout } from '../components/body/TerminalLayout';
import { TerminalText } from '../components/body/TerminalText';
import TerminalStabilityMonitor from '../components/body/TerminalStabilityMonitor';
import { COLORS, GOLD } from '../styles/colors';

const HomePage = () => {
  return (
    <TerminalLayout stabilityValue={50.1} patternType="standard">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', color: GOLD, textAlign: 'center', marginBottom: '2rem' }}>
          GRO<span style={{ fontSize: '0.6em', verticalAlign: 'super' }}>&lt;n&gt;</span>WTH
        </h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <TerminalText type="status">[PATTERN_RECOGNITION_INITIATED]</TerminalText>
          <p style={{ fontFamily: 'Comfortaa, cursive', marginTop: '1rem' }}>
            <TerminalText>Welcome to the</TerminalText> <TerminalText color={GOLD}>GROWTH</TerminalText> <TerminalText>interface. This system allows for pattern recognition and transformation across multiple consciousness layers.</TerminalText>
          </p>
          <p style={{ fontFamily: 'Comfortaa, cursive', marginTop: '1rem' }}>
            <TerminalText>The Terminal Stability Monitor below represents the current state of pattern recognition and synchronicity.</TerminalText>
          </p>
        </div>
        
        <div style={{ width: '100%', height: '400px' }}>
          <TerminalStabilityMonitor />
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <TerminalText type="status">[INTERFACE_CONNECTION_STABLE]</TerminalText>
          <p style={{ fontFamily: 'Comfortaa, cursive', marginTop: '1rem' }}>
            <TerminalText type="glitch" glitchIntensity={2}>This is only the beginning of your journey through the patterns.</TerminalText>
          </p>
        </div>
      </div>
    </TerminalLayout>
  );
};

export default HomePage;