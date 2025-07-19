import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md'

const VerifyEmailPage = ({ onVerified, onBack }: { onVerified: () => void; onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleVerify = async () => {
    try {
        await axios.post('https://payment-form-with-razorpay-integration-1b09.onrender.com/api/auth/verify-email', { email, code });
        setMessage('✅ Verified Successfully');
        onVerified();
        
      } catch (err: any) {
        setMessage(err.response?.data?.error || '❌ Verification Failed');
      }
    };

  const handleResend = async () => {
    try {
        await axios.post('https://payment-form-with-razorpay-integration-1b09.onrender.com/api/auth/resend-code', { email });
        setMessage('✅ Verification code resent to your email');
      } catch (err: any) {
        setMessage(err.response?.data?.error || '❌ Failed to resend code');
      }
    };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8fafa] px-4">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center text-gray-700">Email Verification</h2>
    <div className='flex items-center relative'>
        <input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded-md focus:outline-none"
        />
          <FaEnvelope
            className={`absolute right-2 top-5 transform -translate-y-1/2`}
          />
      </div>

<div className='flex items-center relative'>

        <input
          type="text"
          placeholder="Enter Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full border px-4 py-2 rounded-md focus:outline-none"
        />
         <MdSecurity className={`absolute right-2 top-5 transform -translate-y-1/2`}/>
    </div>

        <button
          onClick={handleVerify}
          className="w-full bg-[#00b5ad] text-white font-semibold py-2 rounded-md hover:bg-[#009c96] transition"
        >
          Verify Email
        </button>

        <button
          onClick={handleResend}
          className="w-full text-[#00b5ad] underline text-sm"
        >
          Resend Verification Code
        </button>

        <button onClick={() => {
  localStorage.removeItem('token');
  onBack();     // This just resets state in App.tsx
  navigate('/login');  // ✅ You also need to navigate back
}}>
  Back to Login
</button>

        {message && <p className="text-center text-red-500 text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
