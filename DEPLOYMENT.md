# 🚀 Deploying HealthBridge to Vercel

This guide will help you deploy your HealthBridge application to Vercel.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Git installed on your computer
- GitHub account (recommended)

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push Your Code to GitHub

1. **Initialize Git Repository** (if not already done):
```bash
cd "C:\Project Websites\ES CARECONNECT\careconnect"
git init
git add .
git commit -m "Initial commit - HealthBridge Healthcare Platform"
```

2. **Create a New Repository on GitHub**:
   - Go to https://github.com/new
   - Name it: `healthbridge-platform`
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. **Push Your Code**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/healthbridge-platform.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. **Go to Vercel Dashboard**:
   - Visit https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import Your GitHub Repository**:
   - Click "Import Git Repository"
   - Select your `healthbridge-platform` repository
   - Click "Import"

3. **Configure Your Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

4. **Add Environment Variables**:
   Click "Environment Variables" and add these (from your Firebase config):

   ```
   VITE_FIREBASE_API_KEY = AIzaSyCYiSTqzsb2WyshOhNuNQPAXv0aQCzAXrM
   VITE_FIREBASE_AUTH_DOMAIN = es-healthbridge.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID = es-healthbridge
   VITE_FIREBASE_STORAGE_BUCKET = es-healthbridge.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID = 30331413637
   VITE_FIREBASE_APP_ID = 1:30331413637:web:ba42d768ad6aed445f75ec
   VITE_FIREBASE_MEASUREMENT_ID = G-1Q1MNZE383
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (2-3 minutes)
   - Your app will be live at: `https://your-project-name.vercel.app`

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
cd "C:\Project Websites\ES CARECONNECT\careconnect"
vercel
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Your account
- **Link to existing project**: No
- **Project name**: healthbridge-platform
- **Directory**: ./ (press Enter)
- **Override settings**: No

### Step 4: Add Environment Variables

```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
vercel env add VITE_FIREBASE_MEASUREMENT_ID
```

For each command, paste the value when prompted and select "Production".

### Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

## Post-Deployment Steps

### 1. Update Firebase Configuration

Add your Vercel domain to Firebase authorized domains:

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: `es-healthbridge`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click "Add domain"
5. Add your Vercel URL: `your-project-name.vercel.app`
6. Save

### 2. Test Your Application

1. Visit your deployed URL
2. Test key features:
   - ✅ User authentication (login/signup)
   - ✅ Dashboard access
   - ✅ Appointment booking
   - ✅ Profile settings
   - ✅ Multi-language switching

### 3. Set Up Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update Firebase authorized domains with your custom domain

## Continuous Deployment

Once deployed, Vercel automatically:
- 🔄 Rebuilds on every push to `main` branch
- 🌿 Creates preview deployments for pull requests
- 📧 Sends email notifications on deployment status

## Troubleshooting

### Build Fails

**Issue**: Build fails with module errors
**Solution**: 
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Working

**Issue**: Firebase connection fails
**Solution**:
1. Check all environment variables are added in Vercel dashboard
2. Make sure variable names start with `VITE_`
3. Redeploy after adding variables

### Routes Don't Work

**Issue**: Direct URLs return 404
**Solution**: This is already fixed with `vercel.json` configuration

### Images Not Loading

**Issue**: Profile photos or assets not displaying
**Solution**: Check Firebase Storage CORS configuration

## Monitoring Your Deployment

### Vercel Dashboard Features

1. **Analytics**: Monitor page views and performance
2. **Logs**: View runtime and build logs
3. **Deployments**: Track deployment history
4. **Speed Insights**: Monitor Core Web Vitals
5. **Security**: SSL certificates (automatic)

## Commands Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel inspect [deployment-url]

# View logs
vercel logs [deployment-url]

# Remove deployment
vercel remove [deployment-name]
```

## Support

If you encounter issues:
- Check Vercel documentation: https://vercel.com/docs
- Visit Vercel community: https://github.com/vercel/vercel/discussions
- Firebase documentation: https://firebase.google.com/docs

## Success! 🎉

Your HealthBridge platform is now live and accessible worldwide!

**Next Steps**:
- Share your app URL with users
- Set up monitoring and analytics
- Configure custom domain
- Set up CI/CD pipeline
- Monitor performance metrics

---

**Deployment URL**: `https://your-project-name.vercel.app`

Enjoy your deployed Healthcare Platform! 🏥✨
