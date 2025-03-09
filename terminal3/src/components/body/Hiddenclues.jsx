import React, { useEffect, useRef } from 'react';
import '../../styles/HiddenClues.css';

const HiddenClues = ({ stabilityValue }) => {
  const canvasRef = useRef(null);
  
  // Determine clue visibility based on stability
  const getClueVisibility = () => {
    if (stabilityValue > 80) return 'hyperpositive';
    if (stabilityValue > 60) return 'positive';
    if (stabilityValue < -80) return 'hypernegative';
    if (stabilityValue < -60) return 'negative';
    return 'neutral';
  };
  
  // Draw hidden patterns on canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set visibility based on stability
    const visibility = getClueVisibility();
    let alpha = 0.03; // Almost invisible by default
    
    if (visibility === 'hyperpositive' || visibility === 'hypernegative') {
      alpha = 0.2; // More visible
    } else if (visibility === 'positive' || visibility === 'negative') {
      alpha = 0.1; // Slightly visible
    }
    
    // Different clues for different stability levels
    switch (visibility) {
      case 'hyperpositive':
        // Draw body pillar clue
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#f7525f';
        ctx.beginPath();
        ctx.font = '12px Consolas';
        ctx.fillStyle = '#f7525f';
        ctx.fillText("FIND THE SEEDS", width * 0.1, height * 0.5);
        ctx.fillText("ROOTS FOLLOW", width * 0.1, height * 0.6);
        ctx.fillText("BRANCHES ARISE", width * 0.1, height * 0.7);
        
        // Draw a subtle triangle
        ctx.moveTo(width * 0.05, height * 0.4);
        ctx.lineTo(width * 0.3, height * 0.4);
        ctx.lineTo(width * 0.175, height * 0.75);
        ctx.closePath();
        ctx.stroke();
        break;
        
      case 'positive':
        // Draw soul pillar clue
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#582a72';
        ctx.fillStyle = '#582a72';
        ctx.font = '10px Consolas';
        
        // Draw a frequency pattern
        for (let i = 0; i < 10; i++) {
          const x = width * 0.1 + i * (width * 0.08);
          const y = height * 0.5 + Math.sin(i * 0.7) * (height * 0.15);
          
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
          
          if (i > 0) {
            const prevX = width * 0.1 + (i - 1) * (width * 0.08);
            const prevY = height * 0.5 + Math.sin((i - 1) * 0.7) * (height * 0.15);
            
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
            ctx.stroke();
          }
        }
        
        ctx.fillText("GROWTH.TRM", width * 0.7, height * 0.9);
        break;
        
      case 'hypernegative':
        // Draw spirit pillar clue
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#002f6c';
        ctx.fillStyle = '#002f6c';
        ctx.font = '10px Consolas';
        
        // Draw a code snippet
        ctx.fillText("function unlock(key, pattern) {", width * 0.1, height * 0.3);
        ctx.fillText("  return key.indexOf(pattern) >= 0;", width * 0.1, height * 0.4);
        ctx.fillText("}", width * 0.1, height * 0.5);
        ctx.fillText("// Try: GRO<n>WTH", width * 0.1, height * 0.7);
        
        // Draw a faint pattern
        ctx.beginPath();
        ctx.arc(width * 0.8, height * 0.5, width * 0.15, 0, Math.PI * 2);
        ctx.moveTo(width * 0.8 - width * 0.15, height * 0.5);
        ctx.lineTo(width * 0.8 + width * 0.15, height * 0.5);
        ctx.moveTo(width * 0.8, height * 0.5 - width * 0.15);
        ctx.lineTo(width * 0.8, height * 0.5 + width * 0.15);
        ctx.stroke();
        break;
        
      case 'negative':
        // Terminal interface clue
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#22ab94';
        ctx.fillStyle = '#22ab94';
        ctx.font = '10px Consolas';
        
        // Draw a coordinates pattern
        ctx.fillText("33.3°N 111.9°W", width * 0.1, height * 0.3);
        ctx.fillText("FREQUENCY RESONANCE", width * 0.1, height * 0.4);
        ctx.fillText("SATURDAY: 7PM", width * 0.1, height * 0.5);
        
        // Draw subtle terminal symbol
        ctx.beginPath();
        ctx.arc(width * 0.8, height * 0.4, width * 0.1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width * 0.8 - width * 0.07, height * 0.4 - width * 0.07);
        ctx.lineTo(width * 0.8 + width * 0.07, height * 0.4 + width * 0.07);
        ctx.moveTo(width * 0.8 - width * 0.07, height * 0.4 + width * 0.07);
        ctx.lineTo(width * 0.8 + width * 0.07, height * 0.4 - width * 0.07);
        ctx.stroke();
        break;
        
      default:
        // No clues in neutral state, but maybe a very faint hint
        ctx.globalAlpha = 0.02;
        ctx.fillStyle = '#ffcc78';
        ctx.font = '8px Consolas';
        ctx.fillText("SEEK THE PATTERN", width * 0.4, height * 0.5);
        break;
    }
  }, [stabilityValue]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="hidden-clues-canvas"
      width={400}
      height={200}
    />
  );
};

export default HiddenClues;