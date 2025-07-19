import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = ({ onLoginSuccess,
}: {
  onLoginSuccess: (userData: { name: string; email: string }) => void;
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleSuccess = async (credentialResponse: any) => {
    try {
      setError('');
      const decoded = jwtDecode<{ name: string; email: string; sub: string }>(credentialResponse.credential);

      const res = await axios.post('https://payment-form-with-razorpay-integration-1b09.onrender.com/api/auth/google', {
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
      });

      localStorage.setItem('token', res.data.token);
      onLoginSuccess({ name: decoded.name, email: decoded.email });
      navigate('/form');
    } catch (err: any) {
      console.error('Google Login Error:', err);
      setError('Google login failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => setError('Google login was cancelled or failed.')}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default GoogleLoginButton;
