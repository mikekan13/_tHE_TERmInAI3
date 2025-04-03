import React, { useState, useEffect } from 'react';
import TerminalCommunityInterface from './components/body/TerminalCommunityInterface';
import LoadingScreen from './components/body/LoadingScreen';
import './App.css';

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
    <div className="App">
      {loading ? (
        <LoadingScreen message="INITIALIZING_CONSCIOUSNESS_INTERFACE" />
      ) : (
        <TerminalCommunityInterface />
      )}
    </div>
  );
}

export default App;