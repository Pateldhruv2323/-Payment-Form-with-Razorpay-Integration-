import React, { useState } from 'react';
import axios from 'axios';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhoneAlt, FaUser } from 'react-icons/fa';
import { AiOutlineEyeInvisible } from 'react-icons/ai';

const AuthPage = ({ onLoginSuccess }: { onLoginSuccess:  (userData: { name: string; email: string }) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev: any) => ({ ...prev, [e.target.name]: '' })); // clear error on change
  };

  const handleSubmit = async () => {
    const newErrors: any = {};
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email address';

    if (!form.password) newErrors.password = 'Password is required';

    if (!isLogin) {
      if (!form.name) newErrors.name = 'Full name is required';
      if (!form.phone) newErrors.phone = 'Phone number is required';
      else if (!/^[6-9]\d{9}$/.test(form.phone)) newErrors.phone = 'Invalid phone number';

      if (!form.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
      else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

      const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (form.password && !passwordStrengthRegex.test(form.password)) {
        newErrors.password = 'Password must be at least 8 characters and include uppercase, lowercase, number & special character';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (isLogin) {
        const res = await axios.post('https://payment-form-with-razorpay-integration-1b09.onrender.com/api/auth/login', {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem('token', res.data.token);
        onLoginSuccess({ name: res.data.name, email: res.data.email });
        navigate('/form');
      } else {
        await axios.post('https://payment-form-with-razorpay-integration-1b09.onrender.com/api/auth/register', {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        });
        navigate('/verify-email');
        setIsLogin(true);
      }
    } catch (err: any) {
      setErrors({ general: err.response?.data?.error || 'Something went wrong' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafa]">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4 border">
        <h2 className="text-[#00b5ad] font-semibold text-2xl text-center">
          {isLogin ? 'Login' : 'Register'}
        </h2>

        {!isLogin && (
          <>
            <div className='flex flex-col relative'>
              <div className='flex items-center relative'>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                />
                <FaUser className="absolute right-2 top-5 transform -translate-y-1/2" />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div className='flex flex-col relative'>
              <div className='flex items-center relative'>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                />
                <FaPhoneAlt className="absolute right-2 top-5 transform -translate-y-1/2" />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </>
        )}

        <div className='flex flex-col relative'>
          <div className='flex items-center relative'>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
            <FaEnvelope className="absolute right-2 top-5 transform -translate-y-1/2" />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className='flex flex-col relative'>
          <div className='flex items-center relative'>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
            <AiOutlineEyeInvisible className="absolute right-2 top-5 transform -translate-y-1/2" />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {!isLogin && (
          <div className='flex flex-col relative'>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
        )}

        {errors.general && <p className="text-red-500 text-xs text-center">{errors.general}</p>}

        <button
          onClick={handleSubmit}
          className="bg-[#00b5ad] text-white py-2 rounded w-full font-semibold hover:bg-[#009c96] transition"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>

        <p className="text-center text-sm">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
            className="text-[#00b5ad] cursor-pointer underline"
          >
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>

        <button onClick={() => navigate('/forgot-password')} className="text-blue-500 underline">
          Forgot Password?
        </button>

        <GoogleLoginButton onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  );
};

export default AuthPage;
