const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const webhookRoutes = require('./routes/webhook');


app.use(cors());
// app.use(express.json());
app.use((req, res, next) => {
    if (req.originalUrl === "/api/webhook") {
      next(); // skip JSON parser for raw body
    } else {
      express.json()(req, res, next);
    }
  });
  app.use('/api/webhook', webhookRoutes);

app.post("/create-order", async (req, res) => {
  try {
    const { name, email, phone, amount, tip, anonymous, address } = req.body;

    if (!amount || !tip) {
      return res.status(400).json({ error: "Amount and tip are required" });
    }

    const tipAmount = Math.round((amount * tip) / 100);
    const total = (amount + tipAmount) * 100;

    
    const fakeOrderId = `order_${Date.now().toString().slice(-6)}`;

    res.json({
      orderId: fakeOrderId,
      amount: total,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID || 'test_key_id',
      name: anonymous ? "Anonymous Donor" : name,
    });
  } catch (err) {
    console.error("🔴 Create Order Error:", err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
});

// Start server
app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
