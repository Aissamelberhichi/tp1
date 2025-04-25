import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './components/Home';
import Navbar from './components/layout/Navbar';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Vous pourriez également récupérer les informations de l'utilisateur ici
    }
  }, []);
  
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} logout={logout} />
        <div className="container">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Home user={user} /> : <Navigate to="/login" />} />
            <Route path="/login" element={!isAuthenticated ? <Login login={login} /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <Register login={login} /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
