# Cloudflare Pages Deployment Guide

## Overview
This guide explains how to deploy Sim-Thailand 2569 to Cloudflare Pages with proper environment variable configuration.

**TL;DR**: Connect your GitHub repo to Cloudflare Pages → Set Firebase env variables → Done! Automatic deployment on every push.

## Prerequisites
- GitHub account with the repository pushed
- Cloudflare account (free or paid)
- Firebase project with credentials

## Step 1: Connect GitHub to Cloudflare Pages

1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Click **"Create a project"**
3. Select **"Connect to Git"**
4. Authorize Cloudflare to access your GitHub account
5. Select your repository: `ThaiSim2026`
6. Click **"Begin setup"**

## Step 2: Configure Build Settings

In the Cloudflare Pages setup wizard:

- **Project name**: `thaisim2569` (or your preferred name)
- **Production branch**: `master` (or `main` if that's your default)
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave default)

## Step 3: Set Environment Variables

This is the MOST IMPORTANT step! Your Firebase credentials must be set here.

### Option A: Via Cloudflare Dashboard (After Initial Deploy)

1. Go to your Pages project in Cloudflare dashboard
2. Navigate to **Settings** → **Environment variables**
3. Click **"Add variable"** and set these variables:

```
VITE_FIREBASE_API_KEY = [your_api_key]
VITE_FIREBASE_AUTH_DOMAIN = [your_project_id].firebaseapp.com
VITE_FIREBASE_PROJECT_ID = [your_project_id]
VITE_FIREBASE_STORAGE_BUCKET = [your_project_id].firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = [your_sender_id]
VITE_FIREBASE_APP_ID = [your_app_id]
VITE_FIREBASE_MEASUREMENT_ID = [your_measurement_id]
```

**Set for**: Production (and Staging if you want)

4. Click **"Save"** and wait for automatic redeploy

### Option B: Using GitHub Secrets (Recommended for Security)

1. In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"** for each variable:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

3. Create GitHub Actions workflow file at `.github/workflows/cloudflare.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ master ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
          VITE_FIREBASE_MEASUREMENT_ID: ${{ secrets.VITE_FIREBASE_MEASUREMENT_ID }}

      - name: Publish to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: thaisim2569
          directory: dist
          productionBranch: master
```

Then set these secrets in GitHub:
- `CLOUDFLARE_API_TOKEN` - Get from Cloudflare dashboard (User Profile → API Tokens)
- `CLOUDFLARE_ACCOUNT_ID` - Get from Cloudflare dashboard (Account settings)

## Step 4: Find Your Firebase Credentials

### Get Firebase Credentials from Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings** (⚙️ icon)
4. Under **"Your apps"**, select your web app
5. Copy the config object that looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "yourproject.firebaseapp.com",
  projectId: "yourproject",
  storageBucket: "yourproject.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123...",
  measurementId: "G-ABC123..."
};
```

Map these to the environment variables:
- `apiKey` → `VITE_FIREBASE_API_KEY`
- `authDomain` → `VITE_FIREBASE_AUTH_DOMAIN`
- `projectId` → `VITE_FIREBASE_PROJECT_ID`
- `storageBucket` → `VITE_FIREBASE_STORAGE_BUCKET`
- `messagingSenderId` → `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `appId` → `VITE_FIREBASE_APP_ID`
- `measurementId` → `VITE_FIREBASE_MEASUREMENT_ID`

## Step 5: Deploy

### Option A: Automatic (Recommended) ⭐
Push to your GitHub repository on the `master` branch, and Cloudflare will automatically:
1. Detect the push
2. Build the project with environment variables
3. Deploy to Cloudflare Pages
4. Give you a URL like: `https://thaisim2569.pages.dev`

**That's it!** No additional steps needed. Cloudflare will rebuild and redeploy on every push.

### Option B: Manual Deployment (Using Wrangler CLI)

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Authenticate with Cloudflare:
```bash
wrangler login
```

3. Create `.env` file in your local project:
```bash
cp .env.example .env
# Edit .env with your actual Firebase credentials
```

4. Build the project:
```bash
npm run build
```

5. Deploy to Cloudflare Pages:
```bash
wrangler pages deploy dist --project-name thaisim2569
```

**Note:** Using GitHub integration (Option A) is recommended as it's simpler and doesn't require local `.env` files.

## Step 6: Configure Custom Domain (Optional)

In Cloudflare Pages:
1. Go to your project → **Settings**
2. Click **"Domains"**
3. Add a custom domain (e.g., `sim-thailand.yourdomain.com`)
4. Follow DNS setup instructions

## Step 7: Verify Firebase Rules

Make sure your Firebase Firestore rules allow anonymous writes to the collections used by the app:

```json
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anonymous reads and writes to sim_results_v7
    match /sim_results_v7/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null || true;
    }

    // Allow anonymous reads and writes to poll_votes_v7
    match /poll_votes_v7/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null || true;
    }
  }
}
```

Go to Firebase Console → Firestore Database → Rules and update accordingly.

## Troubleshooting

### Build Fails with "VITE_FIREBASE_API_KEY undefined"
- ✅ Check environment variables are set in Cloudflare dashboard
- ✅ Make sure variable names match exactly (case-sensitive)
- ✅ Wait a few minutes for variables to propagate
- ✅ Manually trigger a redeploy: Pages → project → "Deployments" → "..." → "Retry deployment"

### SPA Routing Not Working
- ✅ The `_redirects` file must be in your `dist/` folder after build
- ✅ Check that Cloudflare has read the `_redirects` file correctly
- ✅ May need to wait 1-2 minutes for cache to clear

### Firebase Data Not Saving
- ✅ Check Firebase Firestore security rules (see Step 7)
- ✅ Verify Firebase API key is correct
- ✅ Check browser console for errors (F12 → Console tab)

### Build Times Out
- ✅ Cloudflare has a 15-minute build timeout
- ✅ If your build takes longer, optimize dependencies
- ✅ Run `npm audit` and update packages

## Monitoring & Logs

In Cloudflare Pages dashboard:
1. Click your project
2. Go to **"Deployments"** to see build history
3. Click a deployment to see build logs
4. Go to **"Analytics"** to monitor traffic

## Environment Variables Summary

| Variable | Source | Example |
|----------|--------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase Console | `AIzaSyD...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Console | `myapp.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Console | `myapp` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Console | `myapp.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase Console | `1:123456789:web:abc...` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Console | `G-ABC123...` |

## Support

For more information:
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-modes.html)
- [Firebase Client Configuration](https://firebase.google.com/docs/web/setup)

---

**Last Updated**: January 19, 2569 (2026)
**Version**: v1.2
