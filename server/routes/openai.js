const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,  // ✅ Set your Groq API Key in .env
  baseURL: 'https://api.groq.com/openai/v1'  // ✅ Official Groq API URL
});

router.post('/', async (req, res) => {
  try {
    const { name, amount } = req.body;

    const response = await openai.chat.completions.create({
      model: 'llama3-8b-8192',  // ✅ Use Groq supported model
      messages: [
        { role: 'system', content: 'You are a helpful assistant writing thank you messages.' },
        { role: 'user', content: `Write a warm thank you message for ${name} who contributed INR ${amount}.` }
      ]
    });

    res.json({ message: response.choices[0].message.content.trim() });

  } catch (err) {
    console.error('❌ Groq API Error:', err?.message || err);
    res.status(500).json({ error: 'Groq API call failed' });
  }
});

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const OpenAI = require('openai');

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// router.post('/', async (req, res) => {
//   try {
//     const { name, amount } = req.body;
//     const prompt = `Thank you message for ${name} who contributed INR ${amount}`;

//     const completion = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [{ role: 'user', content: prompt }],
//       max_tokens: 50,
//     });

//     res.json({ message: completion.choices[0].message.content.trim() });
//   } catch (err) {
//     console.error('❌ OpenAI Error:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
