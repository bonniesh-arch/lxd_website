import axios from 'axios';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ 
      success: false,
      error: 'API key not configured' 
    });
  }

  try {
    const { message, system, conversationHistory } = req.body;

    console.log('📨 Chat request received...');

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

    // Build request body
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
    if (system && contents.length > 0) {
      contents[0].parts[0].text = system + "\n\nUser message: " + contents[0].parts[0].text;
    }

    console.log('🔄 Sending to Google Gemini API...');

    let response;
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        response = await axios.post(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        break; // success
      } catch (retryError) {
        const status = retryError.response?.status;
        const isRetryable = status === 503 || status === 429 || status === 500;
        if (isRetryable && attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
          console.log(`⚠️ API returned ${status}, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw retryError;
        }
      }
    }

    const aiResponse = response.data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
    console.log('✅ Response received from AI');

    return res.status(200).json({ success: true, message: aiResponse });
  } catch (error) {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to get AI response';
    
    return res.status(500).json({ 
      success: false, 
      error: errorMessage
    });
  }
}
