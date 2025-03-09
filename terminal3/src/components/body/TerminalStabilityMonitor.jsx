import React, { useState, useRef, useEffect, useCallback } from 'react';
import { COLORS, GOLD } from '../../styles/colors';
import { generateSynchronicitySymbols } from '../spirit/SymbolProcessor';
import '../../styles/TerminalStabilityMonitor.css';

function TerminalStabilityMonitor() {
  // Main state
  const [trianglesRotation, setTrianglesRotation] = useState(0);
  const [centerRotation, setCenterRotation] = useState(0);
  const [snakeRotation, setSnakeRotation] = useState(0);
  const [snakeDir, setSnakeDir] = useState(1);
  const [arcLength, setArcLength] = useState(355);
  const [phase, setPhase] = useState("normal");
  const [stabilityValue, setStabilityValue] = useState(-50.0);
  const [fullyStable, setFullyStable] = useState(false);
  
  // Visual effects state
  const [asciiParticles, setAsciiParticles] = useState([]);
  const [patternSparks, setPatternSparks] = useState([]);
  const [asciiOverlay, setAsciiOverlay] = useState(false);
  const [bookSnippets, setBookSnippets] = useState([]);
  const [resetChance, setResetChance] = useState(0.05);
  const [flashParticles, setFlashParticles] = useState([]);
  
  // Waterfall state
  const [waterfallStreams, setWaterfallStreams] = useState([]);
  const [waterfallRunning, setWaterfallRunning] = useState(true);
  
  // Synchronicity state
  const [syncState, setSyncState] = useState({
    active: false,
    level: 0,
    animationProgress: 0
  });

  // References
  const baseSpeedRef = useRef(0.02);
  const lastTimeRef = useRef(0);
  
  // ASCII synergy overlay frames
  const asciiFrames = [
    `[PATTERN_INTERFACE:\n   ESTABLISHING...]`,
    `[UNIVERSAL_FLOW:\n  RECOGNITION++]`,
    `[SYNCHRONICITY:\n   CALIBRATION...]`
  ];
  
  // Example lines from the first 13 pages
  const all13Lines = [
    "1. GRO.WTH is founded on the principle of New Beginnings.",
    "2. The EŶ∃tehrNET weaves all realms and illusions.",
    "3. The Probability Engine balances chance and intent.",
    "4. Seeds, Roots, Branches, Harvests form the cyclical essence.",
    "5. The Terminal is both observer and orchestrator.",
    "6. Magic and technology share the same fundamental patterns.",
    "7. Karmic Value must flow; it cannot remain stagnant.",
    "8. Each recognized rule reveals deeper fractal truths.",
    "9. Fear and desire shape the path to transformation.",
    "10. The Watcher, Probability Engine, Trailblazers, The Terminal.",
    "11. Stories converge in the cosmic tapestry of The Terminal.",
    "12. The GM's Karma Pool shapes reality, balanced by the Terminal.",
    "13. Lifespan is but a measure of cycles granted or bargained for."
  ];

  /*************************
   * UTILITY FUNCTIONS
   *************************/
  
  // Generate truly random characters for waterfall
  const getRandomChar = () => {
    // Different character sets to pull from
    const sets = [
      // Basic Latin characters
      ...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      // Mathematical symbols 
      ...'∀∂∃∅∇∈∉∋∌∏∑−∕∗∙√∝∞∠∡∢∧∨∩∪∫∴∼≅≈≠≤≥⊂⊃⊆⊇⊕⊗⊥⋅⌈⌉⌊⌋⟨⟩',
      // Arrows and symbols
      ...'←↑→↓↔↕↖↗↘↙↺↻⇒⇔∎∴∵∻∽≈≋≡≣⊕⊗',
      // Box drawing (just a few)
      ...'─━│┃┌┍┎┏┐┑┒┓└┕┖┗┘┙┚┛├┝┞┟┠┡┢┣┤┥┦┧┨┩┪┫┬┭┮┯┰┱┲┳┴┵┶┷┸┹┺┻┼┽┾┿╀╁╂╃╄╅╆',
      // East Asian characters (sparse sampling)
      ...'日月火水木金土あいうえおかきくけこンンンㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ',
      // Special characters from symbol codes
      ...'ငတ်δבר水湯⊕Ŷ∞Ω<n>♡'
    ];
    
    // Choose from random character set then random character
    const set = sets[Math.floor(Math.random() * sets.length)];
    return set[Math.floor(Math.random() * set.length)];
  };

  // Helper for calculating circle points
  const getCirclePoint = (radius, angleDeg) => {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return { 
      x: radius * Math.cos(rad), 
      y: radius * Math.sin(rad) 
    };
  };

  // Helper for creating arc paths
  const buildArcPath = (radius, arcDeg) => {
    const half = arcDeg / 2;
    const start = getCirclePoint(radius, -half);
    const end = getCirclePoint(radius, +half);
    const largeArc = (arcDeg > 180) ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  // Calculate stability value from rotation
  const calculateStability = (rotDeg) => {
    const adjusted = ((rotDeg + 90) % 360 + 360) % 360;
    return parseFloat(((adjusted - 180) / 1.8).toFixed(1));
  };

  // Check for synchronicity values
  const getSynchroLevel = (val) => {
    // Round to one decimal place for comparison
    const absVal = Math.abs(parseFloat(val.toFixed(1)));
    
    // Define wider ranges for detection
    // Level 3 (highest)
    if ([3.6, 3.7, 3.8, 6.9, 6.8, 7.0, 9.3, 9.4, 9.5, 
         36.9, 36.8, 37.0, 69.3, 69.2, 69.4, 93.6].includes(absVal)) {
      return 3;
    }
    
    // Level 2 (medium)
    if ([3.3, 3.4, 6.6, 6.7, 9.9, 10.0, 33.3, 33.2, 33.4, 
         66.6, 66.5, 66.7, 99.9, 99.8].includes(absVal)) {
      return 2;
    }
    
    // Level 1 (lowest)
    if ([11.1, 11.0, 11.2, 22.2, 22.3, 44.4, 44.3, 44.5, 
         13.0, 13.1, 26.0, 26.1, 39.0, 39.1].includes(absVal)) {
      return 1;
    }
    
    return 0;
  };

  /*************************
   * EFFECT SPAWNING FUNCTIONS
   *************************/
  
  // Global reset function
  const doGlobalReset = useCallback(() => {
    setBookSnippets([]);
    setPatternSparks([]);
    setAsciiParticles([]);
    setResetChance(0.05);
    const body = document.querySelector('body');
    if (body) {
      body.classList.add('global-flash');
      setTimeout(() => {
        body.classList.remove('global-flash');
      }, 500);
    }
  }, []);

  // Attempt to reach full stability
  const attemptStable = useCallback(() => {
    // If we've collected all 13 lines, finalize at 0.0
    const usedTexts = bookSnippets.map((b) => b.text);
    const uniqueUsed = new Set(usedTexts);
    
    if (uniqueUsed.size >= 13) {
      setFullyStable(true);
      setStabilityValue(0.0);
      setPhase("normal");
      setArcLength(355);
    }
  }, [bookSnippets]);

  // Spawn book snippet
  const spawnBookSnippet = useCallback(() => {
    if (fullyStable) return;
    
    // Pick from lines not used
    const usedSet = new Set(bookSnippets.map((b) => b.text));
    const leftover = all13Lines.filter((l) => !usedSet.has(l));
    
    if (leftover.length < 1) {
      // We have all 13 => chance to forcibly stable
      if (Math.random() < 0.3) {
        attemptStable();
      }
      return;
    }
    
    // Choose a random line and add it
    const line = leftover[Math.floor(Math.random() * leftover.length)];
    const id = Math.random().toString(36).slice(2);
    
    setBookSnippets((prev) => [...prev, { id, text: line }]);
    setResetChance((c) => c + 0.02);
    
    // Chance for global reset
    if (Math.random() < resetChance) {
      doGlobalReset();
    }
  }, [fullyStable, bookSnippets, all13Lines, resetChance, doGlobalReset, attemptStable]);

  // Spawn numeric spark
  const spawnNumericSpark = useCallback((val) => {
    if (fullyStable) return;
    
    const id = Math.random().toString(36).slice(2);
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 70 + 10;
    
    setPatternSparks((prev) => [
      ...prev,
      { id, value: val.toFixed(1), left: x, top: y }
    ]);
    
    setTimeout(() => {
      setPatternSparks((old) => old.filter((s) => s.id !== id));
    }, 3000);
  }, [fullyStable]);

  /*************************
   * WATERFALL IMPLEMENTATION
   *************************/
   
  // Initialize water streams
  useEffect(() => {
    if (!waterfallRunning) return;
    
    // Generate water streams that align with the triangles
    const totalStreams = 6; // Fewer, more purposeful streams
    const newStreams = [];
    
    // Create fixed positions that align with the triangle points
    const fixedPositions = [
      { x: 35, entryPoint: "top", exitPoint: "center", flowDirection: "in" },    // Top left
      { x: 65, entryPoint: "top", exitPoint: "center", flowDirection: "in" },    // Top right
      { x: 25, entryPoint: "left", exitPoint: "center", flowDirection: "in" },   // Middle left
      { x: 75, entryPoint: "right", exitPoint: "center", flowDirection: "in" },  // Middle right
      { x: 40, entryPoint: "center", exitPoint: "bottom", flowDirection: "out" }, // Bottom left exit
      { x: 60, entryPoint: "center", exitPoint: "bottom", flowDirection: "out" }  // Bottom right exit
    ];
    
    // Create streams at fixed positions
    for (let i = 0; i < totalStreams; i++) {
      const position = fixedPositions[i];
      
      // Calculate starting positions based on entry point
      let startX, startY;
      if (position.entryPoint === "top") {
        startX = position.x;
        startY = -5;
      } else if (position.entryPoint === "left") {
        startX = 0;
        startY = 30 + Math.random() * 10;
      } else if (position.entryPoint === "right") {
        startX = 100;
        startY = 30 + Math.random() * 10;
      } else if (position.entryPoint === "center") {
        startX = position.x;
        startY = 45;
      }
      
      newStreams.push({
        id: Math.random().toString(36).slice(2),
        x: startX,
        y: startY,
        speed: 0.8 + Math.random() * 0.4, // More consistent speed for flowing water
        particles: [],
        segmentLength: 20, // How many particles make up a full segment
        width: 3 + Math.random() * 2, // Thinner more consistent width
        flowCurve: Math.sin(i * 0.5) * 15, // Curved path to flow along
        position: position,
        interval: 50, // Tighter interval for continuous flow
        nextDrop: 0,
        isFlowing: true,
        density: 0.8 // Higher density for more continuous appearance
      });
    }
    
    setWaterfallStreams(newStreams);
  }, [waterfallRunning]);

  // Water stream animation
  useEffect(() => {
    if (!waterfallRunning || phase !== "normal" || fullyStable) return;
    
    let lastTime = 0;
    let animationFrameId;
    
    const updateWaterStream = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // Reference to triangle rotation for water mill effect
      const trianglePos = trianglesRotation;
      
      setWaterfallStreams(prevStreams => {
        return prevStreams.map(stream => {
          // Special path calculation based on entry and exit points
          let pathProgress = 0;
          let newX = stream.x;
          let newY = stream.y;
          
          // Determine if we should generate a new particle
          stream.nextDrop -= deltaTime;
          if (stream.nextDrop <= 0) {
            // Reset the interval timer - much shorter for continuous effect
            stream.nextDrop = stream.interval;
            
            // Only add particles at a certain density to control flow
            if (Math.random() < stream.density) {
              // Generate a random character
              const char = getRandomChar();
              
              // Create new water droplet
              const newParticle = {
                id: Math.random().toString(36).slice(2),
                char,
                x: newX + (Math.random() * 2 - 1), // slight variation for organic feel
                y: newY,
                progress: 0, // track position along the curved path
                opacity: 0.8 + Math.random() * 0.2,
                life: 0,
                size: 12 + Math.floor(Math.random() * 3), // more consistent size
                isCopyable: true,
                rotation: 0, // keep characters upright
                flowEffect: Math.random() * 6 - 3, // slight random variation in path
                isConnected: true, // indicate this is part of a flowing stream
                fadePoint: 8000 + Math.random() * 2000 // longer life
              };
              
              // Add to stream
              stream.particles.push(newParticle);
              
              // Maintain proper density by limiting particles
              if (stream.particles.length > 80) { // Higher limit for continuous appearance
                stream.particles.shift();
              }
            }
          }
          
          // Update particles along curved paths
          const updatedParticles = stream.particles.map(particle => {
            // Calculate progress factor (0-1) for path interpolation
            let progressStep = (stream.speed * deltaTime * 0.005);
            let newProgress = particle.progress + progressStep;
            
            // Calculate path based on the stream's flow direction
            let newX, newY;
            
            if (stream.position.flowDirection === "in") {
              // For streams flowing toward the center/wheel
              if (newProgress < 0.5) {
                // First half of journey - flow toward the center
                if (stream.position.entryPoint === "top") {
                  // From top to center
                  newX = particle.x + Math.sin(newProgress * Math.PI) * stream.flowCurve * progressStep;
                  newY = 50 * newProgress * 2; // Move from 0% to 50% vertically
                } else if (stream.position.entryPoint === "left") {
                  // From left to center
                  newX = 50 * newProgress * 2; // Move from 0% to 50% horizontally
                  newY = particle.y + Math.sin(newProgress * Math.PI) * stream.flowCurve * progressStep;
                } else if (stream.position.entryPoint === "right") {
                  // From right to center
                  newX = 100 - (50 * newProgress * 2); // Move from 100% to 50% horizontally
                  newY = particle.y + Math.sin(newProgress * Math.PI) * stream.flowCurve * progressStep;
                }
              } else {
                // After reaching center, particle should follow the triangle rotation
                // Calculate position on the "wheel"
                const angle = trianglePos + (particle.flowEffect * 10) + ((newProgress - 0.5) * 720);
                const radius = 30 - 20 * (newProgress - 0.5) * 2;
                
                newX = 50 + Math.cos(angle * Math.PI / 180) * radius;
                newY = 50 + Math.sin(angle * Math.PI / 180) * radius;
              }
            } else if (stream.position.flowDirection === "out") {
              // For streams flowing outward from the center
              if (newProgress < 0.3) {
                // First part - on the wheel
                const angle = trianglePos + (particle.flowEffect * 10) + (newProgress * 360 * 3);
                const radius = 10 + 20 * newProgress / 0.3;
                
                newX = 50 + Math.cos(angle * Math.PI / 180) * radius;
                newY = 50 + Math.sin(angle * Math.PI / 180) * radius;
              } else {
                // Second part - leaving the wheel
                // Determine exit direction
                if (stream.position.exitPoint === "bottom") {
                  // Progress from center to bottom
                  const normalizedProgress = (newProgress - 0.3) / 0.7; // 0-1 scale
                  newX = stream.position.x + Math.sin(normalizedProgress * Math.PI) * stream.flowCurve * 0.2;
                  newY = 50 + normalizedProgress * 50; // 50% to 100% vertically
                }
              }
            }
            
            // Age the particle
            const newLife = particle.life + deltaTime;
            
            // Fade out based on life
            let newOpacity = particle.opacity;
            if (newLife > particle.fadePoint) {
              newOpacity = Math.max(0, newOpacity - (deltaTime * 0.0003));
            }
            
            return {
              ...particle,
              x: newX,
              y: newY,
              progress: newProgress,
              life: newLife,
              opacity: newOpacity
            };
          });
          
          // Remove particles that have completed their journey or faded
          const filteredParticles = updatedParticles.filter(
            particle => particle.progress < 1.2 && particle.opacity > 0
          );
          
          return {
            ...stream,
            particles: filteredParticles
          };
        });
      });
      
      animationFrameId = requestAnimationFrame(updateWaterStream);
    };
    
    animationFrameId = requestAnimationFrame(updateWaterStream);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [waterfallRunning, phase, fullyStable, trianglesRotation]);

  /*************************
   * SYNCHRONICITY TRIGGER
   *************************/
  
  // Trigger synchronicity event with water stream transformation
  const triggerSynchronicity = useCallback((level) => {
    if (syncState.active || phase !== "normal" || fullyStable) return;
    
    console.log(`Triggering synchronicity level ${level}`);
    
    // Set phase to devouring
    setPhase("devouring");
    
    // Update synchronicity state
    setSyncState({ active: true, level, animationProgress: 0 });
    
    // Generate special symbols for this synchronicity
    const symbolSource = generateSynchronicitySymbols(level, stabilityValue);
    
    // During synchronicity, temporarily transform the water streams into coherent patterns
    setWaterfallStreams(prevStreams => {
      // Choose a few streams to carry the special symbols (1-3 depending on level)
      const streamsToModify = Math.min(level, 3);
      
      return prevStreams.map((stream, index) => {
        // Only modify selected streams
        if (index < streamsToModify) {
          // Clear previous particles to insert our special sequence
          const specialParticles = [];
          
          // Create particles that form the special symbol sequence
          // Position them to flow along the stream path
          [...symbolSource].forEach((char, charIndex) => {
            // Calculate position along the stream path
            const progress = 0.3 + (charIndex * 0.07); // Space them out along the path
            
            // Calculate coordinates based on the stream's path
            let particleX, particleY;
            
            if (stream.position.flowDirection === "in") {
              if (progress < 0.5) {
                // First half of journey - flow toward the center
                if (stream.position.entryPoint === "top") {
                  particleX = stream.x + Math.sin(progress * Math.PI) * stream.flowCurve * 0.1;
                  particleY = 50 * progress * 2; // Move from 0% to 50% vertically
                } else if (stream.position.entryPoint === "left") {
                  particleX = 50 * progress * 2; // Move from 0% to 50% horizontally
                  particleY = stream.y + Math.sin(progress * Math.PI) * stream.flowCurve * 0.1;
                } else if (stream.position.entryPoint === "right") {
                  particleX = 100 - (50 * progress * 2); // Move from 100% to 50% horizontally
                  particleY = stream.y + Math.sin(progress * Math.PI) * stream.flowCurve * 0.1;
                }
              } else {
                // After reaching center, particle should follow the triangle rotation
                const angle = trianglesRotation + ((progress - 0.5) * 360);
                const radius = 30 - (progress - 0.5) * 40;
                
                particleX = 50 + Math.cos(angle * Math.PI / 180) * radius;
                particleY = 50 + Math.sin(angle * Math.PI / 180) * radius;
              }
            } else {
              // For streams flowing outward from the center
              if (progress < 0.5) {
                const angle = trianglesRotation + (progress * 360);
                const radius = 10 + progress * 40;
                
                particleX = 50 + Math.cos(angle * Math.PI / 180) * radius;
                particleY = 50 + Math.sin(angle * Math.PI / 180) * radius;
              } else {
                // Second part - leaving the wheel toward bottom
                const normalizedProgress = (progress - 0.5) / 0.5; // 0-1 scale
                particleX = stream.position.x + Math.sin(normalizedProgress * Math.PI) * stream.flowCurve * 0.2;
                particleY = 50 + normalizedProgress * 50; // 50% to 100% vertically
              }
            }
            
            specialParticles.push({
              id: `synch-${stream.id}-${charIndex}`,
              char,
              x: particleX,
              y: particleY,
              progress: progress,
              opacity: 1.0,
              life: 0,
              size: 22 + (level * 3), // larger based on level
              isCopyable: true,
              isSpecial: true,
              particleClass: `synchro-level-${level}`,
              rotation: 0,
              luminosity: 0.8 + Math.random() * 0.2, // additional glow effect
              pulsate: true, // add pulsating effect
              fadePoint: 10000 // longer lasting
            });
          });
          
          return {
            ...stream,
            particles: specialParticles,
            wasModified: true, // mark as carrying special symbols
            synchronicityLevel: level // store level for reference
          };
        }
        return stream;
      });
    });
    
    // Show ASCII overlay for medium/high levels
    if (level >= 2) {
      setAsciiOverlay(true);
    }
    
    // Spawn a book snippet
    if (Math.random() < 0.7) {
      spawnBookSnippet();
    }
    
    // Duration based on level
    const duration = level === 3 ? 6000 : level === 2 ? 5000 : 4000;
    
    // Reset after duration
    setTimeout(() => {
      console.log("Synchronicity ended");
      setSyncState({ active: false, level: 0, animationProgress: 0 });
      setAsciiOverlay(false);
      
      // Reset modified streams
      setWaterfallStreams(prevStreams => {
        return prevStreams.map(stream => {
          if (stream.wasModified) {
            return {
              ...stream,
              particles: [], // clear special particles
              wasModified: false,
              synchronicityLevel: 0
            };
          }
          return stream;
        });
      });
      
      // Return to normal phase
      setPhase("normal");
    }, duration);
  }, [syncState.active, phase, fullyStable, stabilityValue, spawnBookSnippet, trianglesRotation]);

  /*************************
   * ANIMATION EFFECTS
   *************************/
  
  // Main animation frame for triangles, center, and snake
  useEffect(() => {
    let lastTime = 0;
    let rafId;

    function animateFrame(ts) {
      if (!lastTime) lastTime = ts;
      const delta = ts - lastTime;
      const dt = delta * 0.001;
      lastTime = ts;

      if (!fullyStable) {
        // Triangles rotation
        setTrianglesRotation((prev) => {
          let next = prev;
          if (phase === "normal") {
            const speedVar = Math.sin(ts * 0.001) * 0.005;
            const speed = baseSpeedRef.current + speedVar;
            next = (prev + dt * speed * 369 * 6) % 360;
            
            // Occasionally force rotation to hit special values
            if (Math.random() < 0.003) {
              const specialAngles = [
                173.4, 167.9, 163.1, // Values that trigger level 3
                175.1, 168.1, 162.0, // Values that trigger level 2
                160.0, 140.0, 170.0  // Values that trigger level 1
              ];
              next = specialAngles[Math.floor(Math.random() * specialAngles.length)];
            }
          }
          return next;
        });

        // Center rotation (CCW)
        setCenterRotation((prev) => {
          let next = prev;
          if (phase === "normal") {
            const speedVar = Math.sin(ts * 0.001) * 0.005;
            const speed = baseSpeedRef.current + speedVar;
            next = (prev - dt * speed * 369 * 3) % 360;
          }
          return next;
        });

        // Snake rotation (faster)
        setSnakeRotation((prev) => {
          let next = prev;
          if (phase === "normal") {
            const speedVar = Math.sin(ts * 0.001) * 0.005;
            const speed = baseSpeedRef.current + speedVar;
            next = (prev + dt * speed * 369 * 9 * snakeDir) % 360;
          }
          return next;
        });

        // Arc length for snake (devour/regrow)
        setArcLength((prevArc) => {
          if (phase === "normal") {
            // breathing animation
            const breathSpeed = 0.8;
            const minLen = 320;
            const maxLen = 355;
            const mid = (minLen + maxLen) / 2;
            const range = maxLen - minLen;
            const breath = Math.sin(ts * 0.001 * breathSpeed) * (range / 2);
            return mid + breath;
          } else if (phase === "devouring") {
            // Devouring animation
            const devourTime = 0.5;
            const arcChange = 355 * (dt / devourTime);
            let nextArc = prevArc - arcChange;
            
            if (nextArc <= 0) {
              nextArc = 0;
              setSnakeDir((d) => -d);
              setPhase("regrowing");
            }
            return nextArc;
          } else if (phase === "regrowing") {
            // Regrowing animation
            const growTime = 0.5;
            const arcChange = 355 * (dt / growTime);
            let nextArc = prevArc + arcChange;
            
            if (nextArc >= 355) {
              nextArc = 355;
              setPhase("normal");
            }
            return nextArc;
          }
          return prevArc;
        });
      }

      // Calculate stability value from triangles rotation
      setTrianglesRotation((prevTri) => {
        const st = calculateStability(prevTri);
        setStabilityValue(st);
        return prevTri;
      });

      rafId = requestAnimationFrame(animateFrame);
    }

    rafId = requestAnimationFrame(animateFrame);
    return () => cancelAnimationFrame(rafId);
  }, [phase, snakeDir, fullyStable]);

  // Synergy animation
  useEffect(() => {
    if (!syncState.active) return;
    
    let last = 0;
    let rafId;
    
    function synergyAnim(ts) {
      if (!last) last = ts;
      const dt = (ts - last) * 0.001;
      
      setSyncState((prev) => ({
        ...prev,
        animationProgress: prev.animationProgress + dt
      }));
      
      last = ts;
      rafId = requestAnimationFrame(synergyAnim);
    }
    
    rafId = requestAnimationFrame(synergyAnim);
    return () => cancelAnimationFrame(rafId);
  }, [syncState.active]);

  // Attempt stabilization periodically
  useEffect(() => {
    if (fullyStable) return;
    
    const stableInterval = setInterval(() => {
      const usedTexts = bookSnippets.map((b) => b.text);
      const uniqueUsed = new Set(usedTexts);
      
      if (uniqueUsed.size >= 13) {
        if (Math.random() < 0.2) {
          setFullyStable(true);
          setStabilityValue(0.0);
          setPhase("normal");
          setArcLength(355);
        }
      }
    }, 2000);
    
    return () => clearInterval(stableInterval);
  }, [fullyStable, bookSnippets]);

  // Synchronicity detection
  useEffect(() => {
    if (phase !== "normal" || fullyStable) return;
    
    const synergyInt = setInterval(() => {
      // Log stability occasionally
      if (Math.random() < 0.05) {
        console.log(`Current stability: ${stabilityValue.toFixed(1)}`);
      }
      
      // Check for synchronicity values
      const lvl = getSynchroLevel(stabilityValue);
      
      if (lvl > 0) {
        console.log(`Synchronicity detected! Value: ${stabilityValue.toFixed(1)}, Level: ${lvl}`);
        
        // High chance to trigger
        if (Math.random() < 0.9) {
          triggerSynchronicity(lvl);
          spawnNumericSpark(stabilityValue);
        }
      }
    }, 100);
    
    return () => clearInterval(synergyInt);
  }, [phase, fullyStable, stabilityValue, triggerSynchronicity, spawnNumericSpark]);

  // Periodic forced synchronicity
  useEffect(() => {
    if (fullyStable) return;
    
    const forceSynchInterval = setInterval(() => {
      if (phase === "normal" && !syncState.active) {
        if (Math.random() < 0.05) { // 5% chance every 10 seconds
          console.log("Forcing occasional synchronicity");
          const level = Math.floor(Math.random() * 3) + 1;
          
          triggerSynchronicity(level);
        }
      }
    }, 10000);
    
    return () => clearInterval(forceSynchInterval);
  }, [phase, syncState.active, fullyStable, triggerSynchronicity]);

  /*************************
   * RENDER
   *************************/
  
  // Marker IDs based on snake direction
  const headMarkerId = (snakeDir === 1) ? "snakeHead" : "snakeTail";
  const tailMarkerId = (snakeDir === 1) ? "snakeTail" : "snakeHead";

  // Get current overlay frame
  const overlayIndex = Math.floor(syncState.animationProgress * 3) % asciiFrames.length;
  const overlayFrame = asciiFrames[overlayIndex];

  return (
    <div className="tsm-container">
      {/* Water streams and effects */}
      {phase === "normal" && !fullyStable && (
        <div className="water-stream-container">
          {/* Stream paths - visible flowing water */}
          {waterfallStreams.map(stream => (
            <div 
              key={`stream-${stream.id}`} 
              className={`water-stream ${stream.wasModified ? 'synchro-stream' : ''} ${stream.position.flowDirection}-flow`}
              style={{ 
                // Position streams relative to the container
                // For water mill effect, streams relate to the 50% center point
                opacity: 0.3,
                zIndex: 3
              }}
            >
              {/* Tracing the path with a semi-transparent line for water effect */}
              {stream.position.flowDirection === "in" && (
                <div className="stream-path incoming-path" style={{
                  position: 'absolute',
                  background: stream.wasModified ? 
                    `linear-gradient(to bottom, rgba(${stream.synchronicityLevel === 3 ? '255, 204, 120' : 
                      stream.synchronicityLevel === 2 ? '88, 42, 114' : '247, 82, 95'}, 0.1), 
                      rgba(${stream.synchronicityLevel === 3 ? '255, 204, 120' : 
                      stream.synchronicityLevel === 2 ? '88, 42, 114' : '247, 82, 95'}, 0.6))` : 
                    'linear-gradient(to bottom, rgba(0, 47, 108, 0.1), rgba(0, 47, 108, 0.4))',
                  width: `${stream.width}px`,
                  height: stream.position.entryPoint === "top" ? '50%' : '10%',
                  left: stream.position.entryPoint === "top" ? `${stream.x}%` : 
                        stream.position.entryPoint === "left" ? '0' : 'auto',
                  right: stream.position.entryPoint === "right" ? '0' : 'auto',
                  top: stream.position.entryPoint === "top" ? '0' : `${stream.y}%`,
                  transformOrigin: 'top center',
                  transform: stream.position.entryPoint === "top" ? 
                    `translateX(-50%) rotate(${stream.flowCurve * 0.1}deg)` :
                    stream.position.entryPoint === "left" ? 
                    `rotate(${-45 + stream.flowCurve * 0.1}deg)` :
                    `rotate(${45 + stream.flowCurve * 0.1}deg)`,
                  borderRadius: '3px'
                }}></div>
              )}
              
              {stream.position.flowDirection === "out" && (
                <div className="stream-path outgoing-path" style={{
                  position: 'absolute',
                  background: stream.wasModified ? 
                    `linear-gradient(to bottom, rgba(${stream.synchronicityLevel === 3 ? '255, 204, 120' : 
                      stream.synchronicityLevel === 2 ? '88, 42, 114' : '247, 82, 95'}, 0.6), 
                      rgba(${stream.synchronicityLevel === 3 ? '255, 204, 120' : 
                      stream.synchronicityLevel === 2 ? '88, 42, 114' : '247, 82, 95'}, 0.1))` : 
                    'linear-gradient(to bottom, rgba(0, 47, 108, 0.4), rgba(0, 47, 108, 0.1))',
                  width: `${stream.width}px`,
                  height: '50%',
                  left: `${stream.position.x}%`,
                  top: '50%',
                  transformOrigin: 'top center',
                  transform: `translateX(-50%) rotate(${stream.flowCurve * 0.1}deg)`,
                  borderRadius: '3px'
                }}></div>
              )}
              
              {/* Particles flowing along the stream path */}
              {stream.particles.map(particle => (
                <div
                  key={particle.id}
                  className={`water-particle ${particle.isSpecial ? 'synchro-level-' + (stream.synchronicityLevel || syncState.level) : ''} ${particle.isConnected ? 'connected-particle' : ''} ${particle.pulsate ? 'pulsating' : ''}`}
                  style={{
                    position: 'absolute',
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    fontSize: `${particle.size}px`,
                    opacity: particle.opacity,
                    transform: `translate(-50%, -50%) rotate(${particle.rotation}deg)`,
                    textShadow: particle.luminosity ? 
                      `0 0 ${5 + (particle.luminosity * 5)}px rgba(${stream.synchronicityLevel === 3 ? '255, 204, 120' : 
                      stream.synchronicityLevel === 2 ? '88, 42, 114' : '247, 82, 95'}, ${particle.luminosity})` : undefined,
                    zIndex: particle.isSpecial ? 100 : 10
                  }}
                >
                  {particle.char}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* SVG visualization */}
      <svg viewBox="0 0 400 400" className="tsm-svg" style={{ background: 'linear-gradient(to bottom, #000000, #111111)' }}>
  {/* Grid pattern */}
  <defs>
    <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#582a72" strokeWidth="0.5" opacity="0.2"/>
    </pattern>
    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
      <rect width="100" height="100" fill="url(#smallGrid)"/>
      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#582a72" strokeWidth="1" opacity="0.4"/>
    </pattern>
    
    {/* Enhanced glow effects */}
    <filter id="enhancedGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    
    {/* Color gradients for the triangles */}
    <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#f7525f" stopOpacity="0.7"/>
      <stop offset="100%" stopColor="#ea9999" stopOpacity="0.9"/>
    </linearGradient>
    
    <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#582a72" stopOpacity="0.7"/>
      <stop offset="100%" stopColor="#8e7cc3" stopOpacity="0.9"/>
    </linearGradient>
    
    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#002f6c" stopOpacity="0.7"/>
      <stop offset="100%" stopColor="#6fa8dc" stopOpacity="0.9"/>
    </linearGradient>

          <marker id="snakeHead"
            markerWidth="8" markerHeight="8"
            refX="4" refY="4" orient="auto"
          >
            <path d="M0,2 L8,4 L0,6 Z" fill="#f7525f"/>
          </marker>
          <marker id="snakeTail"
            markerWidth="6" markerHeight="6"
            refX="3" refY="3" orient="auto"
          >
            <path d="M0,3 L6,4 L6,2 Z" fill="#002f6c"/>
          </marker>
        </defs>

        <rect width="400" height="400" fill="#000"/>

        <g transform="translate(200,200)">
          {/* Ouroboros snake */}
          <g style={{ transform: `rotate(${snakeRotation}deg)` }}>
            <path
              d={buildArcPath(140, arcLength)}
              fill="none"
              stroke="#22ab94"
              strokeWidth="4"
              strokeLinecap="round"
              markerStart={`url(#${tailMarkerId})`}
              markerEnd={`url(#${headMarkerId})`}
            />
          </g>

          {/* Triangles (rotate CW) */}
          <g style={{ transform: `rotate(${trianglesRotation}deg)` }}>
  <path
    d="M-100,-100 L100,-100 L0,100 Z"
    fill="rgba(247, 82, 95, 0.2)"
    stroke="#f7525f"
    strokeWidth="2"
  />
  <path
    d="M100,-100 L100,100 L-100,0 Z"
    fill="rgba(88, 42, 114, 0.2)"
    stroke="#582a72"
    strokeWidth="2"
  />
  <path
    d="M-100,100 L100,100 L0,-100 Z"
    fill="rgba(111, 168, 220, 0.2)"
    stroke="#6fa8dc"
    strokeWidth="2"
  />
</g>

          {/* Center symbol (rotate CCW) */}
          <g style={{ transform: `rotate(${centerRotation}deg)` }}>
            <circle r="40" fill="none" stroke="#ffcc78" strokeWidth="2"/>
            <path
              d="M-30,-30 L30,30 M-30,30 L30,-30"
              stroke="#fff"
              strokeWidth="2"
            />
          </g>
        </g>

{/* Status text */}
<g>
  {/* Top status panel */}
  <rect x="10" y="10" width="200" height={syncState.active ? 75 : 55} 
        fill="rgba(0,0,0,0.7)" stroke="#582a72" strokeWidth="1.5"/>
  
  <text x="20" y="30" fontFamily="monospace" fontSize="14" fill="#22ab94">
    [PATTERN_STABILITY: {stabilityValue.toFixed(1)}%]
  </text>
  
  <text x="20" y="50" fontFamily="monospace" fontSize="14" fill="#f7525f">
    [PHASE: {phase.toUpperCase()}]
  </text>
  
  {fullyStable && (
    <text x="20" y="70" fontFamily="monospace" fontSize="14" fill="#ffcc78">
      [STABILIZED_AT_0.0%]
    </text>
  )}
  
  {syncState.active && (
    <text x="20" y="70" fontFamily="monospace" fontSize="14" fill="#ffcc78">
      [SYNCHRONICITY_LEVEL_{syncState.level}]
    </text>
  )}
  
  {/* Bottom status panel */}
  <rect x="10" y="340" width="200" height="50" 
        fill="rgba(0,0,0,0.7)" stroke="#582a72" strokeWidth="1.5"/>
        
  <text x="20" y="360" fontFamily="monospace" fontSize="14" fill="#582a72">
    [TERMINAL_INTERFACE::TIME_SYNCH]
  </text>
  
  <text x="20" y="380" fontFamily="monospace" fontSize="14" fill="#6fa8dc">
    [PATTERN_RECOGNITION_ACTIVE]
  </text>
</g>
    </svg>

      {/* Numeric sparks */}
      {patternSparks.map((spark) => (
        <div
          key={spark.id}
          className="pattern-spark"
          style={{
            left: `${spark.left}%`,
            top: `${spark.top}%`
          }}
        >
          {spark.value}
        </div>
      ))}

      {/* ASCII synchronicity overlay */}
      {asciiOverlay && (
        <div className={`ascii-overlay synchro-level-${syncState.level}`}>
          <pre className="ascii-frame">
            {overlayFrame}
          </pre>
        </div>
      )}

      {/* Book snippet container */}
      <div className="book-snippet-container">
        {bookSnippets.map((snip) => (
          <div key={snip.id} className="book-snippet">
            {snip.text}
          </div>
        ))}
      </div>

      {/* Test Synchronicity Button */}
      <button 
        onClick={() => {
          console.log("Forcing synchronicity");
          triggerSynchronicity(3);
        }}
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.5)',
          color: '#22ab94',
          border: '1px solid #22ab94',
          padding: '5px',
          fontSize: '10px',
          cursor: 'pointer',
          zIndex: 100
        }}
      >
        [TEST_SYNCH]
      </button>

      {/* Waterfall control button */}
      <button 
        onClick={() => setWaterfallRunning(prev => !prev)}
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.5)',
          color: '#22ab94',
          border: '1px solid #22ab94',
          padding: '5px',
          fontSize: '10px',
          cursor: 'pointer',
          zIndex: 100
        }}
      >
        [WATERFALL_{waterfallRunning ? 'STOP' : 'START'}]
      </button>
    </div>
  );
}

export default TerminalStabilityMonitor;