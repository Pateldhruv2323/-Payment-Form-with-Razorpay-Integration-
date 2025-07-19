import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';

const ForgotPasswordPage = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleSend = async () => {
    try {
      await axios.post('https://payment-form-with-razorpay-integration-1b09.onrender.com/api/auth/forgot-password', { email });
      setMessage('✅ Reset link sent. Check your email.');
    } catch (err: any) {
      setMessage(err.response?.data?.error || '❌ Failed to send link');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafa]">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4 border text-center">
        <h2 className="text-2xl font-semibold text-[#00b5ad]">Forgot Password</h2>

    <div className='flex items-center relative'>
        <input
          type="email"
          placeholder="Enter your email"
          className="border rounded px-3 py-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FaEnvelope
         className={`absolute right-2 top-5 transform -translate-y-1/2`}
         />
     </div>

        <button
          onClick={handleSend}
          className="bg-[#00b5ad] text-white py-2 rounded w-full font-semibold hover:bg-[#009c96] transition"
        >
          Send Reset Link
        </button>

        <button onClick={() => {
  localStorage.removeItem('token');
  onBack();     // This just resets state in App.tsx
  navigate('/login');  // ✅ You also need to navigate back
}}>
  Back to Login
</button>

        {message && <p className="text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
