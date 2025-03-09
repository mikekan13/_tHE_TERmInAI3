import React, { useState, useEffect, useRef } from 'react';
import { COLORS, GOLD } from '../../styles/colors';
import '../../styles/CommunityStabilityMonitor.css';

const CommunityStabilityMonitor = ({ stabilityValue = -50.0, hasHiddenClue = false }) => {
  const [rotation, setRotation] = useState(0);
  const [centerRotation, setCenterRotation] = useState(0);
  const [arcLength, setArcLength] = useState(320);
  const [glitchActive, setGlitchActive] = useState(false);
  const [hiddenCluesVisible, setHiddenCluesVisible] = useState(false);
  const canvasRef = useRef(null);
  
  // Calculate phase based on stability value
  const getPhase = () => {
    if (stabilityValue > 66) return "hyperpositive";
    if (stabilityValue > 33) return "positive";
    if (stabilityValue > -33) return "neutral";
    if (stabilityValue > -66) return "negative";
    return "hypernegative";
  };
  
  // Main animation effect
  useEffect(() => {
    let lastTime = 0;
    let rafId;
    
    function animateFrame(ts) {
      if (!lastTime) lastTime = ts;
      const delta = ts - lastTime;
      const dt = delta * 0.001;
      lastTime = ts;
      
      // Triangle rotation
      setRotation(prev => (prev + dt * 15) % 360);
      
      // Center symbol rotation (opposite direction)
      setCenterRotation(prev => (prev - dt * 10) % 360);
      
      // Arc breathing animation
      setArcLength(prev => {
        const phase = Math.sin(ts * 0.001 * 0.5);
        return 320 + phase * 35;
      });
      
      // Occasional glitch effect
      if (Math.random() < 0.003) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 500);
      }
      
      rafId = requestAnimationFrame(animateFrame);
    }
    
    rafId = requestAnimationFrame(animateFrame);
    return () => cancelAnimationFrame(rafId);
  }, []);
  
  // Draw pattern particles on canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw particles based on stability value
    const particleCount = 50 + Math.abs(stabilityValue);
    const phase = getPhase();
    
    let particleColor;
    switch (phase) {
      case "hyperpositive":
        particleColor = COLORS.RED_1;
        break;
      case "positive":
        particleColor = COLORS.BLUE_2;
        break;
      case "neutral":
        particleColor = GOLD;
        break;
      case "negative":
        particleColor = COLORS.PURPLE_2;
        break;
      case "hypernegative":
        particleColor = "#333333";
        break;
      default:
        particleColor = COLORS.BLUE_3;
    }
    
    // Draw connecting lines between particles
    ctx.strokeStyle = particleColor;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    
    // Draw particles
    for (let i = 0; i < particleCount; i++) {
      const x = Math.sin(i * 0.1 + rotation * 0.02) * (width / 2 - 20) + width / 2;
      const y = Math.cos(i * 0.1 + rotation * 0.02) * (height / 2 - 20) + height / 2;
      
      ctx.fillStyle = particleColor;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(x, y, 2, 2);
      
      // Draw lines to nearby particles
      if (i > 0) {
        const prevX = Math.sin((i - 1) * 0.1 + rotation * 0.02) * (width / 2 - 20) + width / 2;
        const prevY = Math.cos((i - 1) * 0.1 + rotation * 0.02) * (height / 2 - 20) + height / 2;
        
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // If stability is above a threshold and hidden clue is available, show special pattern
    if (hasHiddenClue && Math.abs(stabilityValue) > 69 && !hiddenCluesVisible) {
      setHiddenCluesVisible(true);
      
      // Draw hidden pattern
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = GOLD;
      ctx.beginPath();
      
      // Draw a complex pattern that resembles something meaningful
      // This could be coordinates, a symbol, or part of a sequence
      ctx.moveTo(width * 0.3, height * 0.3);
      ctx.lineTo(width * 0.7, height * 0.3);
      ctx.lineTo(width * 0.7, height * 0.7);
      ctx.lineTo(width * 0.3, height * 0.7);
      ctx.closePath();
      
      // Draw an inner symbol
      ctx.moveTo(width * 0.5, height * 0.3);
      ctx.lineTo(width * 0.5, height * 0.7);
      ctx.moveTo(width * 0.3, height * 0.5);
      ctx.lineTo(width * 0.7, height * 0.5);
      
      ctx.stroke();
      
      // Add subtle text
      ctx.fillStyle = GOLD;
      ctx.font = '8px Consolas';
      ctx.globalAlpha = 0.1;
      ctx.fillText("33.3°N 111.9°W", width * 0.42, height * 0.48);
      
      setTimeout(() => setHiddenCluesVisible(false), 5000);
    }
  }, [rotation, stabilityValue, hasHiddenClue, hiddenCluesVisible]);
  
  return (
    <div className={`community-monitor ${getPhase()} ${glitchActive ? 'glitching' : ''}`}>
      <canvas 
        ref={canvasRef} 
        className="pattern-canvas"
        width={400}
        height={400}
      />
      
      <svg viewBox="0 0 400 400" className="monitor-svg">
        <g transform="translate(200,200)">
          {/* Triangles (rotate CW) */}
          <g style={{ transform: `rotate(${rotation}deg)` }}>
            <path
              d="M-100,-100 L100,-100 L0,100 Z"
              className="triangle triangle-red"
            />
            <path
              d="M100,-100 L100,100 L-100,0 Z"
              className="triangle triangle-purple"
            />
            <path
              d="M-100,100 L100,100 L0,-100 Z"
              className="triangle triangle-blue"
            />
          </g>

          {/* Center symbol (rotate CCW) */}
          <g style={{ transform: `rotate(${centerRotation}deg)` }}>
            <circle r="40" className="center-circle" />
            <path
              d="M-30,-30 L30,30 M-30,30 L30,-30"
              className="center-cross"
            />
          </g>
          
          {/* Arc (snake) */}
          <g>
            <path
              d={`M-140,0 A140,140 0 0,1 ${140 * Math.cos((arcLength * Math.PI) / 180)},${140 * Math.sin((arcLength * Math.PI) / 180)}`}
              className="monitor-arc"
            />
          </g>
        </g>
        
        {/* Status text */}
        <g fontFamily="Consolas, monospace" fontSize="14">
          <text x="20" y="30" className="status-text primary">
            [PATTERN_STABILITY: {stabilityValue.toFixed(1)}%]
          </text>
          <text x="20" y="50" className="status-text secondary">
            [PHASE: {getPhase().toUpperCase()}]
          </text>
          
          {glitchActive && (
            <text x="20" y="70" className="status-text alert">
              [SYNCHRONICITY_DETECTED]
            </text>
          )}
          
          <text x="20" y="350" className="status-text info">
            [TERMINAL_INTERFACE::COMMUNITY_STREAM]
          </text>
          
          <text x="20" y="370" className="status-text info secondary">
            [PATTERN_RECOGNITION_ACTIVE]
          </text>
        </g>
      </svg>
    </div>
  );
};

export default CommunityStabilityMonitor;