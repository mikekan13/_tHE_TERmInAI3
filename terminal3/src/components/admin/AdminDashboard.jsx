import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminCode, setAdminCode] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [messageToApprove, setMessageToApprove] = useState(null);

  // Fetch messages from the API
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/admin/messages', {
        headers: { 'x-admin-token': localStorage.getItem('adminToken') }
      });
      setMessages(response.data.messages || []);
      setFilteredMessages(response.data.filteredMessages || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch messages. Please check your authentication.');
      setLoading(false);
      // If unauthorized, clear admin token
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('adminToken');
        setAuthenticated(false);
      }
    }
  };

  // Check for existing admin token on component mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  // Handle admin login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('/api/admin/login', { adminCode });
      
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        setAuthenticated(true);
        setError(null);
        fetchData();
      }
    } catch (err) {
      setError('Invalid admin code');
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAuthenticated(false);
    setMessages([]);
    setFilteredMessages([]);
  };

  // Refetch data when needed
  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated, fetchData]);

  // Handle message deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/messages/${id}`, {
        headers: { 'x-admin-token': localStorage.getItem('adminToken') }
      });
      // Refresh data after deletion
      fetchData();
      setMessageToDelete(null);
    } catch (err) {
      setError('Failed to delete message');
    }
  };

  // Handle approving filtered message
  const handleApprove = async (id) => {
    try {
      await axios.post(`/api/admin/messages/${id}/approve`, {}, {
        headers: { 'x-admin-token': localStorage.getItem('adminToken') }
      });
      // Refresh data after approval
      fetchData();
      setMessageToApprove(null);
    } catch (err) {
      setError('Failed to approve message');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-text">[LOADING_ADMIN_INTERFACE]</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="admin-login-container">
        <h2 className="admin-login-header">[TERMINAL_ADMIN_AUTHENTICATION]</h2>
        {error && <div className="admin-error">{error}</div>}
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-input-group">
            <label htmlFor="adminCode">[ADMIN_CODE]</label>
            <input
              type="password"
              id="adminCode"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              className="admin-input"
            />
          </div>
          <button type="submit" className="admin-button">
            [AUTHENTICATE]
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1 className="admin-title">[TERMINAL_ADMIN_INTERFACE]</h1>
        <button onClick={handleLogout} className="admin-logout-button">
          [DISCONNECT]
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-content">
        {/* Filtered Messages Section */}
        <div className="admin-section">
          <h2 className="admin-section-header">[FILTERED_MESSAGES]</h2>
          {filteredMessages.length === 0 ? (
            <div className="admin-empty-message">No filtered messages to review.</div>
          ) : (
            <div className="admin-message-list">
              {filteredMessages.map((msg) => (
                <div key={msg._id} className="admin-message-item filtered">
                  <div className="admin-message-timestamp">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                  <div className="admin-message-content">{msg.content}</div>
                  <div className="admin-message-reason">
                    Filtered reason: {msg.filterReason || 'Unknown'}
                  </div>
                  <div className="admin-message-actions">
                    {messageToApprove === msg._id ? (
                      <div className="admin-confirmation">
                        <span>Confirm approval?</span>
                        <button
                          onClick={() => handleApprove(msg._id)}
                          className="admin-confirm-button"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setMessageToApprove(null)}
                          className="admin-cancel-button"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setMessageToApprove(msg._id)}
                        className="admin-approve-button"
                      >
                        Approve
                      </button>
                    )}
                    
                    {messageToDelete === msg._id ? (
                      <div className="admin-confirmation">
                        <span>Confirm deletion?</span>
                        <button
                          onClick={() => handleDelete(msg._id)}
                          className="admin-confirm-button"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setMessageToDelete(null)}
                          className="admin-cancel-button"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setMessageToDelete(msg._id)}
                        className="admin-delete-button"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approved Messages Section */}
        <div className="admin-section">
          <h2 className="admin-section-header">[APPROVED_MESSAGES]</h2>
          {messages.length === 0 ? (
            <div className="admin-empty-message">No messages found.</div>
          ) : (
            <div className="admin-message-list">
              {messages.map((msg) => (
                <div key={msg._id} className="admin-message-item">
                  <div className="admin-message-timestamp">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                  <div className="admin-message-content">{msg.content}</div>
                  <div className="admin-message-impact">
                    Impact: {msg.impact?.toFixed(1) || '0.0'}
                  </div>
                  <div className="admin-message-actions">
                    {messageToDelete === msg._id ? (
                      <div className="admin-confirmation">
                        <span>Confirm deletion?</span>
                        <button
                          onClick={() => handleDelete(msg._id)}
                          className="admin-confirm-button"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setMessageToDelete(null)}
                          className="admin-cancel-button"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setMessageToDelete(msg._id)}
                        className="admin-delete-button"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;