import React, { useState, useEffect } from 'react';
import TerminalConsciousnessInterface from './components/body/TerminalConsciousnessInterface';
import LoadingScreen from './components/body/LoadingScreen';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen message="INITIALIZING_CONSCIOUSNESS_INTERFACE" />
      ) : (
        <TerminalConsciousnessInterface />
      )}
    </>
  );
}

export default App;