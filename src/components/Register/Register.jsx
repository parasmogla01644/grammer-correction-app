import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Register.scss';

function Register({ onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);


    if (!username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/users/register', { username, password });
      onRegisterSuccess(response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register__container">
      <div className="register__form">
        <h1 className="register__title">Grammar Correction App</h1>
        <h2 className="register__subtitle">Create an Account</h2>
        {error && <div className="register__error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="register__form-group">
            <label className="register__label">Username</label>
            <input
              className="register__input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
            />
          </div>
          <div className="register__form-group">
            <label className="register__label">Password</label>
            <input
              className="register__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
            />
          </div>
          <div className="register__form-group">
            <label className="register__label">Confirm Password</label>
            <input
              className="register__input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>
          <button className="register__button" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="register__login-link">
          <p>Already have an account? <Link to="/">Login</Link></p>
        </div>
        <div className="register__note">
          <p>Note: For demo purposes, register with any username and password</p>
        </div>
      </div>
    </div>
  );
}

export default Register; 