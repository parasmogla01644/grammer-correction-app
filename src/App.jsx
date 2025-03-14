import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import GrammarCheck from './components/GrammarCheck/GrammarCheck';

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {

    
    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/grammar-check" /> : <Login onLogin={login} />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/grammar-check" /> : <Register onRegisterSuccess={login} />} 
          />
          <Route 
            path="/grammar-check" 
            element={isAuthenticated ? <GrammarCheck onLogout={logout} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 