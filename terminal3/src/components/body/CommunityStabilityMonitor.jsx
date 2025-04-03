import React, { useState, useEffect } from 'react';
import '../../styles/CommunityStabilityMonitor.css';

const CommunityStabilityMonitor = ({ stabilityValue = 0 }) => {
  const [rotation, setRotation] = useState(0);
  const [phase, setPhase] = useState('normal');
  
  // Calculate visual rotation based on stability value
  useEffect(() => {
    // Convert stability percentage to rotation degrees
    // Where 0% = 0°, 100% = 360°
    const newRotation = (stabilityValue * 3.6); // 3.6 = 360/100
    setRotation(newRotation);
    
    // Determine phase based on stability
    if (Math.abs(stabilityValue) > 80) {
      setPhase('critical');
    } else if (Math.abs(stabilityValue) > 50) {
      setPhase('warning');
    } else {
      setPhase('normal');
    }
  }, [stabilityValue]);

  return (
    <div className="community-monitor-container">
      <svg viewBox="0 0 400 400" className="community-monitor-svg">
        <defs>
          <linearGradient id="communityGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22ab94" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#22ab94" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="100%" height="100%" fill="#000" />
        
        {/* Grid pattern */}
        <g className="grid-pattern">
          {Array.from({ length: 10 }).map((_, i) => (
            <React.Fragment key={`grid-h-${i}`}>
              <line 
                x1="0" 
                y1={40 * i} 
                x2="400" 
                y2={40 * i} 
                stroke="#22ab94" 
                strokeWidth="0.5" 
                strokeOpacity="0.2" 
              />
              <line 
                x1={40 * i} 
                y1="0" 
                x2={40 * i} 
                y2="400" 
                stroke="#22ab94" 
                strokeWidth="0.5" 
                strokeOpacity="0.2" 
              />
            </React.Fragment>
          ))}
        </g>

        {/* Center visualization */}
        <g transform="translate(200, 200)">
          {/* Rotating triangles based on stability */}
          <g style={{ transform: `rotate(${rotation}deg)` }}>
            <path 
              d="M-80,-80 L80,-80 L0,80 Z" 
              fill="none" 
              stroke={stabilityValue > 0 ? "#f7525f" : "#6fa8dc"} 
              strokeWidth="2" 
              opacity="0.8" 
            />
            <path 
              d="M80,-80 L80,80 L-80,0 Z" 
              fill="none" 
              stroke="#582a72" 
              strokeWidth="2" 
            />
            <path 
              d="M-80,80 L80,80 L0,-80 Z" 
              fill="none" 
              stroke={stabilityValue < 0 ? "#f7525f" : "#6fa8dc"} 
              strokeWidth="2" 
              opacity="0.8" 
            />
          </g>
          
          {/* Central circle */}
          <circle 
            r="50" 
            fill="url(#communityGlow)" 
            stroke="#22ab94" 
            strokeWidth="1" 
          />
          
          {/* Collective symbol */}
          <g>
            <circle r="25" fill="none" stroke="#ffcc78" strokeWidth="1" />
            <path 
              d="M-15,-15 L15,15 M-15,15 L15,-15" 
              stroke="#ffffff" 
              strokeWidth="1.5" 
            />
          </g>
        </g>

        {/* Status indicators */}
        <g className="status-text" fontFamily="monospace">
          <text x="20" y="30" fill="#22ab94" fontSize="12">
            [COLLECTIVE_STABILITY: {stabilityValue.toFixed(1)}%]
          </text>
          <text x="20" y="50" fill={phase === 'normal' ? '#22ab94' : phase === 'warning' ? '#ffcc78' : '#f7525f'} fontSize="12">
            [PHASE: {phase.toUpperCase()}]
          </text>
          <text x="20" y="370" fill="#582a72" fontSize="12">
            [COMMUNITY_INTERFACE::PATTERN_RECOGNITION]
          </text>
        </g>
      </svg>
    </div>
  );
};

export default CommunityStabilityMonitor;