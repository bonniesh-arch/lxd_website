# Deployment Guide: Vercel

## Prerequisites
- GitHub account (to push your code)
- Vercel account (free at vercel.com)

## Step 1: Prepare Your Code
All the necessary changes have been made:
- ✅ Created `/api/chat.js` - serverless function for Vercel
- ✅ Updated `vercel.json` - Vercel configuration
- ✅ Updated all frontend files to use dynamic API URLs
- ✅ Code works both locally and on Vercel

## Step 2: Push to GitHub

```bash
cd /Users/bonnie/Desktop/LXD
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI (Fastest)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd /Users/bonnie/Desktop/LXD
vercel
```

3. Follow the prompts:
   - Link to GitHub repo when asked
   - Select project name
   - Confirm framework as "Other"

4. When prompted for environment variables, enter:
   - Name: `GOOGLE_API_KEY`
   - Value: `AIzaSyAu9tzteSN4tSmMejq9FFTAA2MKkIzhgK0`

### Option B: Using Vercel Web Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: Choose "Other"
   - Build Command: `npm run build || true`
   - Output Directory: `.`
   - **Environment Variables:**
     - Key: `GOOGLE_API_KEY`
     - Value: `AIzaSyAu9tzteSN4tSmMejq9FFTAA2MKkIzhgK0`
6. Click "Deploy"

## Step 4: Share Your App

Once deployed, you'll get a URL like: `https://your-project.vercel.app`

Share this with anyone! The API will work without needing to run a local server.

## Troubleshooting

If the API returns errors:

1. **Check environment variable is set:**
   - Go to Vercel project settings → Environment Variables
   - Verify `GOOGLE_API_KEY` is present

2. **API Key Issues:**
   - If you get "high demand" errors, wait a few minutes and retry
   - If errors persist, regenerate your API key:
     - Go to [Google Cloud Console](https://console.cloud.google.com/)
     - Navigate to APIs & Services → Credentials
     - Create a new API key
     - Update in Vercel environment variables

3. **Test the API:**
   ```bash
   curl https://your-project.vercel.app/api/chat \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"message":"Hello","system":"Test","conversationHistory":[]}'
   ```

## Local Development

Continue using your local setup:
```bash
npm start
```

The app will automatically detect localhost and use `http://localhost:3001` for API calls.

## What's New

- **Serverless Function:** `/api/chat.js` replaces Express server
- **Environment Variables:** API key stored securely on Vercel
- **Dynamic Routing:** Frontend automatically detects deployment environment
- **No Runtime Costs:** Vercel serverless functions are free tier compatible
