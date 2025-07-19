require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const mongoose = require("mongoose");
const crypto = require("crypto");
const openaiRoutes = require('./routes/openai');
const authRoutes = require('./routes/auth.routes');


const app = express();


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));


const Payment = mongoose.model('Payment', new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  amount: Number,
  tip: Number,
  totalAmount: Number,
  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
}));


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.use(cors({
  origin: ["http://localhost:3000", "https://razorpaypaymentform.netlify.app"],
  credentials: true,
}));

// app.use((req, res, next) => {
//   if (req.originalUrl === "/api/webhook") {
//     next();
//   } else {
//     express.json()(req, res, next);
//   }
// });
app.use(express.json());

app.use('/api/openai', openaiRoutes);
app.use('/api/auth', authRoutes);


const webhookRoutes = require('./routes/webhook');
app.use('/api/webhook', webhookRoutes);


app.post("/create-order", async (req, res) => {
  try {
    const { name, email, phone, amount, tip, anonymous, address } = req.body;

    if (!amount || !tip) return res.status(400).json({ error: "Amount and tip required" });

    const tipAmount = Math.round((amount * tip) / 100);
    const total = (amount + tipAmount) * 100;

    const options = {
      amount: total,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    const payment = new Payment({
      name: anonymous ? "Anonymous Donor" : name,
      email: anonymous ? "" : email,
      phone,
      amount,
      tip,
      totalAmount: total,
      razorpay_order_id: order.id
    });

    await payment.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      name: anonymous ? "Anonymous Donor" : name
    });

  } catch (err) {
    console.error("❌ Create Order Error:", err);
    res.status(500).json({ error: err.message });
  }
});


app.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      await Payment.findOneAndUpdate(
        { razorpay_order_id },
        { razorpay_payment_id, razorpay_signature, status: "Success" }
      );
      console.log(`✅ Payment Verified for Order: ${razorpay_order_id}`);
      res.json({ status: "Payment Verified" });
      
    } else {
      res.status(400).json({ status: "Invalid Signature" });
    }
  } catch (err) {
    console.error("❌ Payment Verification Error:", err);
    res.status(500).json({ error: err.message });
  }
});


app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
app.get('/', (req, res) => {
    res.send('✅ API is Live');
  });