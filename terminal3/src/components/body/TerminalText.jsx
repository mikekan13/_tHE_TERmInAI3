import React from 'react';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/typography';

export const TerminalText = ({ 
  children, 
  type = 'standard', // standard, glitch, status, consciousness
  color,
  bg,
  font,
  glitchIntensity = 0,
  className = '',
  ...props 
}) => {
  // Determine styling based on type
  let styles = {
    fontFamily: font || FONTS.CONSOLAS,
  };
  
  // Handle different text types
  switch(type) {
    case 'status':
      styles = {
        ...styles,
        color: color || COLORS.TEAL,
        fontFamily: FONTS.CONSOLAS,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      };
      break;
    case 'consciousness':
      styles = {
        ...styles,
        color: color || COLORS.GOLD,
        fontFamily: FONTS.INKNUT,
      };
      break;
    case 'glitch':
      styles = {
        ...styles,
        position: 'relative',
        color: color || COLORS.WHITE_TEXT,
        fontFamily: FONTS.CONSOLAS,
      };
      break;
    default:
      styles = {
        ...styles,
        color: color || COLORS.WHITE_TEXT,
      };
  }
  
  // Add background if specified
  if (bg) {
    styles.backgroundColor = bg;
    styles.padding = '0 0.1em';
  }
  
  // Handle glitch effect
  if (type === 'glitch' && glitchIntensity > 0) {
    return (
      <span className={`terminal-text glitch-text ${className}`} style={styles} {...props}>
        <span className="glitch-base">{children}</span>
        <span className="glitch-layer" data-content={children} style={{ '--glitch-intensity': glitchIntensity }}></span>
        <span className="glitch-layer" data-content={children} style={{ '--glitch-intensity': glitchIntensity * 1.5 }}></span>
      </span>
    );
  }
  
  return (
    <span className={`terminal-text ${className}`} style={styles} {...props}>
      {children}
    </span>
  );
};