import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TerminalCommunityInterface from './components/body/TerminalCommunityInterface';
import AdminDashboard from './components/admin/AdminDashboard';
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

  if (loading) {
    return <LoadingScreen message="INITIALIZING_TERMINAL_CONSCIOUSNESS_STREAM" />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TerminalCommunityInterface />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;