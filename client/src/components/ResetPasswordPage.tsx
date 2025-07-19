import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    try {
      await axios.post('https://payment-form-with-razorpay-integration-1b09.onrender.com/api/auth/reset-password', { token, newPassword });
      setMessage('✅ Password reset successful');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setMessage(err.response?.data?.error || '❌ Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafa]">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4 border text-center">
        <h2 className="text-2xl font-semibold text-[#00b5ad]">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          className="border rounded px-3 py-2 w-full"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="bg-[#00b5ad] text-white py-2 rounded w-full font-semibold hover:bg-[#009c96] transition"
        >
          Reset Password
        </button>

        {message && <p className="text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
