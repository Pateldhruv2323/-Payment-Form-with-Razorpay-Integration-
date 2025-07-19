const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const VerificationCode = require('../models/verificationCode.model');
const sendMail = require('../utils/mailer');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Register with Email Verification
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields required' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    // ✅ Generate Code & Send Email BEFORE sending response
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await VerificationCode.create({
      userId: user._id,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins expiry
    });

    await sendMail(
      email,
      'Verify Your Email',
      `Your verification code is: ${code}`
    );

    res.json({ message: 'User registered successfully. Please verify your email.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Login with Email Verification Check
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email & Password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    if (!user.isVerified)
      return res.status(400).json({ error: 'Please verify your email before login' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Google Login — Considered Verified by Default
router.post('/google', async (req, res) => {
  try {
    const { name, email, googleId } = req.body;
    if (!email || !googleId)
      return res.status(400).json({ error: 'Invalid data' });

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email, googleId, isVerified: true });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/verify-email', async (req, res) => {
    try {
      const { email, code } = req.body;
  
      if (!email || !code) return res.status(400).json({ error: 'Email & Code required' });
  
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'User not found' });
  
      const record = await VerificationCode.findOne({ userId: user._id, code });
      if (!record || record.expiresAt < Date.now())
        return res.status(400).json({ error: 'Invalid or expired code' });
  
      user.isVerified = true;
      await user.save();
      await VerificationCode.deleteMany({ userId: user._id });
  
      res.json({ message: 'Email verified successfully' });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/resend-code', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'Email required' });
  
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'User not found' });
  
      if (user.isVerified) return res.status(400).json({ error: 'User already verified' });
  
      // Delete old codes
      await VerificationCode.deleteMany({ userId: user._id });
  
      const code = Math.floor(100000 + Math.random() * 900000).toString();
  
      await VerificationCode.create({
        userId: user._id,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });
  
      await sendMail(email, 'Resend Verification Code', `Your new verification code is: ${code}`);
  
      res.json({ message: 'Verification code resent successfully' });
  
    } catch (err) {
      console.error('❌ Resend Code Error:', err);
      res.status(500).json({ error: err.message });
    }
  });
  

  router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'User not found' });
  
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '10m' });
      const link = `https://razorpaypaymentform.netlify.app/reset-password/${token}`;
  
      await sendMail(email, 'Reset Your Password', `Click to reset: ${link}`);
      res.json({ message: 'Password reset link sent to your email' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Reset Password
  router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const hashed = await bcrypt.hash(newPassword, 10);
      await User.findByIdAndUpdate(decoded.id, { password: hashed });
      res.json({ message: 'Password reset successful' });
    } catch (err) {
      res.status(400).json({ error: 'Invalid or expired token' });
    }
  });
  
module.exports = router;
