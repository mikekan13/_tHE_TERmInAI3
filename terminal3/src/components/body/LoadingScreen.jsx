import React, { useState, useEffect } from 'react';
import { COLORS } from '../../styles/colors';

const LoadingScreen = ({ message = 'INITIALIZING_CONNECTION' }) => {
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    let animationId;
    const animate = () => {
      setRotation(prev => (prev + 1) % 360);
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ 
        backgroundColor: COLORS.BLACK_1,
        fontFamily: 'Consolas, monospace',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50
      }}
    >
      <div style={{ width: '256px', height: '256px', position: 'relative', marginBottom: '32px' }}>
        {/* Rotating triangles */}
        <div 
          style={{ 
            transform: `rotate(${rotation}deg)`,
            position: 'absolute',
            inset: 0
          }}
        >
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <path 
              d="M50,10 L90,90 L10,90 Z" 
              fill="none" 
              stroke={COLORS.RED_1} 
              strokeWidth="1"
              opacity="0.8"
            />
            <path 
              d="M10,10 L90,10 L50,90 Z" 
              fill="none" 
              stroke={COLORS.PURPLE_1} 
              strokeWidth="1"
            />
            <path 
              d="M90,10 L90,90 L10,50 Z" 
              fill="none" 
              stroke={COLORS.BLUE_2} 
              strokeWidth="1"
              opacity="0.8"
            />
          </svg>
        </div>
        
        {/* Center symbol */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: `2px solid ${COLORS.TEAL}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: `1px solid ${COLORS.TEAL}`,
                opacity: 0.5
              }}
            />
          </div>
        </div>
      </div>

      {/* Status text */}
      <div style={{ color: COLORS.TEAL, fontSize: '1.125rem' }}>
        [{message}]
      </div>
      
      <div 
        style={{
          marginTop: '1rem',
          fontSize: '0.875rem',
          color: `${COLORS.TEAL}`,
          opacity: 0.7
        }}
      >
        [PATTERN_STABILITY: {(rotation / 3.6).toFixed(1)}%]
      </div>
    </div>
  );
};

export default LoadingScreen;