import React, { useState, useEffect } from 'react';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [stabilityValues, setStabilityValues] = useState({});
  const [authToken, setAuthToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Handle admin login
  const handleLogin = (e) => {
    e.preventDefault();
    // In a real implementation, this would verify with your backend
    // For demo purposes, we'll just use a simple check
    if (authToken === 'your-secret-admin-token') {
      setIsAuthenticated(true);
      localStorage.setItem('adminToken', authToken);
      fetchData();
    } else {
      alert('Invalid authentication token');
    }
  };
  
  // Check if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);
  
  // Fetch data when authenticated
  const fetchData = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-auth-token': authToken
      };
      
      const [messagesRes, filteredRes] = await Promise.all([
        fetch('/api/admin/messages', { headers }),
        fetch('/api/admin/filtered-messages', { headers })
      ]);
      
      const messagesData = await messagesRes.json();
      const filteredData = await filteredRes.json();
      
      if (messagesData.success) {
        setMessages(messagesData.messages);
        
        // Initialize stability values
        const initialValues = {};
        messagesData.messages.forEach(msg => {
          initialValues[msg._id] = msg.stabilityImpact || 0;
        });
        setStabilityValues(initialValues);
      }
      
      if (filteredData.success) {
        setFilteredMessages(filteredData.messages);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);
  
  // Toggle message selection
  const toggleSelectMessage = (messageId) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };
  
  // Update stability rating
  const updateStability = (messageId, value) => {
    setStabilityValues(prev => ({
      ...prev,
      [messageId]: value
    }));
  };
  
  // Submit Terminal response
  const submitTerminalResponse = async () => {
    if (!responseMessage.trim() || selectedMessages.length === 0) return;
    
    try {
      const response = await fetch('/api/admin/terminal-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': authToken
        },
        body: JSON.stringify({
          content: responseMessage,
          respondingTo: selectedMessages,
          stabilityValues
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Terminal response scheduled successfully for the next Saturday at 7pm!');
        setResponseMessage('');
        setSelectedMessages([]);
        
        // Refresh data
        fetchData();
      } else {
        alert(result.message || 'Failed to schedule response.');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('An error occurred while scheduling the response.');
    }
  };
  
  // Toggle message approval
  const toggleApproval = async (messageId, currentApproval) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': authToken
        },
        body: JSON.stringify({
          approved: !currentApproval
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setMessages(prev => 
          prev.map(msg => 
            msg._id === messageId 
              ? { ...msg, approved: !currentApproval }
              : msg
          )
        );
      } else {
        alert(result.message || 'Failed to update message.');
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };
  
  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <h1 className="admin-title">Terminal Admin Access</h1>
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="authToken">[ADMIN_AUTHENTICATION_TOKEN]</label>
            <input
              id="authToken"
              type="password"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              placeholder="Enter authentication token"
              required
            />
          </div>
          <button type="submit" className="admin-submit-btn">
            [ACCESS_TERMINAL_CONTROLS]
          </button>
        </form>
      </div>
    );
  }
  
  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Terminal Admin Interface</h1>
      
      <div className="dashboard-grid">
        <div className="messages-panel">
          <h2 className="panel-title">[USER_MESSAGES]</h2>
          <div className="messages-list">
            {messages.map(message => (
              <div 
                key={message._id} 
                className={`admin-message ${selectedMessages.includes(message._id) ? 'selected' : ''} ${message.approved ? 'approved' : 'unapproved'}`}
                onClick={() => toggleSelectMessage(message._id)}
              >
                <div className="message-header">
                  <span className="message-time">{new Date(message.timestamp).toLocaleString()}</span>
                  <span className="message-ip">{message.userIp}</span>
                </div>
                <div className="message-body">{message.content}</div>
                <div className="message-footer">
                  <label className="stability-input">
                    Stability Impact:
                    <input 
                      type="number" 
                      min="-10"
                      max="10"
                      step="0.1"
                      value={stabilityValues[message._id] || 0}
                      onChange={(e) => updateStability(message._id, parseFloat(e.target.value))}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </label>
                  <button 
                    className={`approval-btn ${message.approved ? 'approved' : 'unapproved'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleApproval(message._id, message.approved);
                    }}
                  >
                    {message.approved ? '[APPROVED]' : '[UNAPPROVED]'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="response-panel">
          <h2 className="panel-title">[TERMINAL_RESPONSE]</h2>
          <div className="selected-messages">
            <h3>Selected Messages: {selectedMessages.length}</h3>
            <ul>
              {selectedMessages.map(id => {
                const message = messages.find(m => m._id === id);
                return message ? (
                  <li key={id}>{message.content.substring(0, 50)}...</li>
                ) : null;
              })}
            </ul>
          </div>
          <textarea
            className="response-textarea"
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            placeholder="Enter The Terminal's response..."
            rows={10}
          />
          <button 
            className="submit-response-btn"
            onClick={submitTerminalResponse}
            disabled={!responseMessage.trim() || selectedMessages.length === 0}
          >
            [SCHEDULE_TERMINAL_RESPONSE]
          </button>
        </div>
        
        <div className="filtered-panel">
          <h2 className="panel-title">[FILTERED_MESSAGES]</h2>
          <div className="messages-list">
            {filteredMessages.map(message => (
              <div key={message._id} className="admin-message filtered">
                <div className="message-header">
                  <span className="message-time">{new Date(message.timestamp).toLocaleString()}</span>
                  <span className="message-ip">{message.userIp}</span>
                </div>
                <div className="message-body">{message.content}</div>
                <div className="message-reason">
                  <span>Reason: {message.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;