# Cloudflare Pages Build Error - Solution

## Problem
Build fails with error about Wrangler trying to deploy assets.

## Root Cause
Cloudflare Pages is incorrectly configured or there's a cached build configuration.

## Solution

### Step 1: Clear Build Cache in Cloudflare Dashboard

1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Select your project: `thaisim2569`
3. Go to **Settings** → **Builds & deployments**
4. Click **Clear Cache** (if available)

### Step 2: Verify Build Configuration

1. Still in **Settings** → **Builds & deployments**
2. Check **Build command**:
   ```
   npm run build
   ```
3. Check **Build output directory**:
   ```
   dist
   ```
4. **Production branch**:
   ```
   master
   ```

**Important:** Make sure these are set EXACTLY as shown above.

### Step 3: Verify Environment Variables

1. Go to **Settings** → **Environment variables**
2. Make sure all 7 Firebase variables are set for **Production**:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

### Step 4: Trigger a Rebuild

Option A (Recommended):
1. Go to **Deployments** tab
2. Find the failed deployment
3. Click the **...** menu
4. Click **Retry deployment**

Option B:
1. Push a new commit to GitHub:
   ```bash
   git commit --allow-empty -m "chore: trigger rebuild"
   git push origin master
   ```

### Step 5: Monitor the Build

1. Go to **Deployments** tab
2. Watch the new deployment build
3. Click on it to see logs
4. Should see:
   ```
   ✓ Installed dependencies
   ✓ Built successfully
   ✓ Deployed successfully
   ```

## Troubleshooting

### Still getting Wrangler error?
- [ ] Check that **Build output directory** is `dist` (not something else)
- [ ] Check that **Build command** is `npm run build`
- [ ] Make sure there's no `wrangler.toml` or similar config
- [ ] Try clearing browser cache and hard refresh

### Build logs not showing output?
- [ ] Click on the deployment to see full build logs
- [ ] Check for any environment variable errors
- [ ] Verify Firebase credentials are correct

### Pages taking too long to build?
- [ ] Cloudflare has a 15-minute timeout
- [ ] Check if `npm install` is taking too long
- [ ] Try running locally: `npm run build`

## Verify Deployment Success

Once build succeeds, your site should be live at:
```
https://thaisim2026.autobahn.bot
```

Test it by:
1. Opening the URL in browser
2. Should see Sim-Thailand 2569 game
3. Check browser DevTools (F12) → Console for any errors
4. Firebase should be loading data

## Final Check

- ✅ Git repo: https://github.com/bejranonda/ThaiSim2026
- ✅ Live site: https://thaisim2026.autobahn.bot
- ✅ Build command: `npm run build`
- ✅ Output dir: `dist`
- ✅ SPA routing: `_redirects` file present

---

**Still not working?**
- Check Cloudflare status: https://www.cloudflarestatus.com
- Review full build logs in Cloudflare dashboard
- Verify local build works: `npm run build && npm run preview`
