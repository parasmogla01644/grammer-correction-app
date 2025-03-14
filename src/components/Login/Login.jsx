import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.scss';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Both username and password are required');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/users/login', { username, password });
      onLogin(response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login__container">
      <div className="login__form">
        <h1 className="login__title">Grammar Correction App</h1>
        <h2 className="login__subtitle">Login</h2>
        {error && <div className="login__error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="login__form-group">
            <label className="login__label">Username</label>
            <input
              className="login__input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          <div className="login__form-group">
            <label className="login__label">Password</label>
            <input
              className="login__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <button className="login__button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="login__register-link">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
        <div className="login__note">
          <p>Note: For demo purposes, register with any username and password</p>
        </div>
      </div>
    </div>
  );
}

export default Login; 