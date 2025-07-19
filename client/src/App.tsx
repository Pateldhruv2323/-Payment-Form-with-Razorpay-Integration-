import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import Form from './pages/Form';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setIsVerified] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const verified = localStorage.getItem('isVerified') === 'true';
    const storedUser = localStorage.getItem('user');

    if (token) setIsAuthenticated(true);
    if (verified) setIsVerified(true);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isVerified');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setIsVerified(false);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            <AuthPage
              onLoginSuccess={(userData) => {
                setIsAuthenticated(true);
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
              }}
            />
          }
        />
        <Route
          path="/verify-email"
          element={
            <VerifyEmailPage
              onVerified={() => {
                setIsVerified(true);
                window.location.href = '/form';
              }}
              onBack={() => {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
              }}
            />
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ForgotPasswordPage
              onBack={() => {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
              }}
            />
          }
        />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route
          path="/form"
          element={
            isAuthenticated && user ? (
              <Form onLogout={handleLogout} userData={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
