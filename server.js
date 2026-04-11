const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

app.post('/api/chat', async (req, res) => {
  try {
    console.log('📨 Chat request received...');
    const { message, system, conversationHistory } = req.body;

    // Build conversation context
    const contents = conversationHistory.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Build request body with optional system instruction
    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      }
    };

    // Add system instruction if provided
    if (system) {
      requestBody.systemInstruction = {
        parts: [{ text: system }]
      };
    }

    console.log('🔄 Sending to Google Gemini API...');
    const response = await axios.post(
      API_URL,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
    console.log('✅ Response received from AI');
    
    res.json({ success: true, message: aiResponse });
  } catch (error) {
    console.error('❌ API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      error: error.response?.data?.error?.message || error.message || 'Failed to get AI response' 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'Server running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 API Key configured:`, !!GOOGLE_API_KEY ? 'Yes ✓' : 'No ✗');
  console.log(`🔌 CORS enabled\n`);
});
