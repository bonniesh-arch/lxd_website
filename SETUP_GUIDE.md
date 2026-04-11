# Google Gemini AI Integration Setup

## Quick Start

### Step 1: Get Your Google API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Create API Key"** button
3. Copy your API key

### Step 2: Create `.env` File

In your `/Users/bonnie/Desktop/LXD` folder, create a file named `.env`:

```
GOOGLE_API_KEY=your_api_key_here
PORT=3001
```

Replace `your_api_key_here` with your actual API key from Step 1.

### Step 3: Install Dependencies

Open Terminal and run:

```bash
cd /Users/bonnie/Desktop/LXD
npm install
```

This installs: express, cors, axios, and dotenv

### Step 4: Start the Server

```bash
npm start
```

You should see:
```
Server running on http://localhost:3001
API Key configured: Yes
```

### Step 5: Test the App

1. Keep the server running in Terminal
2. Open your app in browser
3. Go through the Crazy 8s activity
4. When you reach "AI Researcher Feedback", chat should work with real Google Gemini API

---

## How It Works

1. **Frontend** (HTML/JS) sends user messages to your Node.js backend
2. **Backend** (server.js) securely adds your API key and calls Google Gemini API
3. **Response** comes back to frontend and displays in chat
4. Your API key is **never exposed** to users ✅

---

## Troubleshooting

**Error: "Connection error. Please ensure your backend server is running"**
- Make sure server is running: `npm start`
- Server should be on `http://localhost:3001`

**Error: "Failed to get AI response"**
- Check your API key in `.env` file is valid
- Go to Google AI Studio and verify key works

**Error: npm command not found**
- Install Node.js from [nodejs.org](https://nodejs.org)
- Then run `npm install` again

---

## Files Created

- `server.js` - Backend that handles API calls
- `.env` - Your API key (keep secret!)
- `package.json` - Dependencies list
- `ai-feedback.js` - Updated to call backend

## To Deploy

For production, use services like:
- **Vercel** (Node.js friendly)
- **Heroku** 
- **Railway**
- **Render**

They all support Node.js with environment variable setup.
