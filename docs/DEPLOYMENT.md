# Goal Tracker - Deployment Guide

Complete guide for deploying the Goal Tracker application to free hosting platforms.

## 🎯 Deployment Overview

- **Backend:** Render (Free Tier)
- **Database:** Supabase (Free Tier)
- **Web App:** Vercel (Free Tier)
- **Mobile App:** GitHub Releases / Google Play

## 📊 Free Tier Limits

### Supabase (Database)
- ✅ 500MB database storage
- ✅ 2GB bandwidth per month
- ✅ Unlimited API requests
- ✅ Automatic backups
- ✅ SSL included

### Render (Backend)
- ✅ 512MB RAM
- ✅ 750 hours/month free
- ⚠️ Sleeps after 15 min inactivity
- ✅ Auto-deploy from Git
- ✅ SSL included

### Vercel (Web)
- ✅ 100GB bandwidth
- ✅ Unlimited sites
- ✅ Automatic SSL
- ✅ Edge functions
- ✅ Preview deployments

---

## 🗄️ Database Deployment (Supabase)

### 1. Create Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in with GitHub
3. Click "New Project"
4. Configure:
   - **Name:** goal-tracker-prod
   - **Database Password:** Generate strong password
   - **Region:** Choose closest to users
5. Wait for provisioning (~2 minutes)

### 2. Run Migrations

```bash
# Get connection string from Supabase dashboard
# Settings → Database → Connection string

# Set environment variable
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Run migrations
cd backend
npm run migrate
```

### 3. Configure Security

1. Go to **Settings → Database**
2. Enable **Connection Pooling** (recommended)
3. Note the pooler connection string for production

### 4. Backup Configuration

Supabase provides automatic daily backups on free tier.

To enable point-in-time recovery (paid feature):
- Settings → Database → Point in Time Recovery

---

## 🚀 Backend Deployment (Render)

### 1. Prepare Repository

Ensure your backend code is in a Git repository (GitHub, GitLab, or Bitbucket).

```bash
cd backend
git init
git add .
git commit -m "Initial backend commit"
git remote add origin https://github.com/yourusername/goal-tracker-backend.git
git push -u origin main
```

### 2. Create Render Service

1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:

**Basic Settings:**
- **Name:** goal-tracker-api
- **Region:** Choose closest to users
- **Branch:** main
- **Root Directory:** backend (if monorepo) or leave blank
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Instance Type:**
- Select "Free" ($0/month)

### 3. Environment Variables

Add these in Render dashboard (Environment tab):

```env
NODE_ENV=production
PORT=5000

# Database (from Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# JWT Secrets (generate new ones for production!)
JWT_SECRET=your-production-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-production-refresh-secret-min-32-chars

# CORS (add your Vercel domain)
CORS_ORIGIN=https://your-app.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
```

**Generate Production Secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Start the server
3. Wait for deployment (~2-3 minutes)
4. Your API will be available at: `https://goal-tracker-api.onrender.com`

### 5. Test Deployment

```bash
curl https://goal-tracker-api.onrender.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Goal Tracker API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### 6. Keep Service Awake (Optional)

Render free tier sleeps after 15 minutes of inactivity. To prevent this:

**Option 1: Use a Cron Job Service**
- [cron-job.org](https://cron-job.org) (free)
- Ping your health endpoint every 10 minutes

**Option 2: UptimeRobot**
- [uptimerobot.com](https://uptimerobot.com) (free)
- Monitor health endpoint every 5 minutes

---

## 🌐 Web App Deployment (Vercel)

### 1. Prepare Repository

```bash
cd web
git init
git add .
git commit -m "Initial web app commit"
git remote add origin https://github.com/yourusername/goal-tracker-web.git
git push -u origin main
```

### 2. Deploy to Vercel

**Option A: Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd web
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? goal-tracker-web
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

**Option B: Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your repository
5. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** web (if monorepo) or ./
   - **Build Command:** `npm run build`
   - **Output Directory:** .next
6. Click "Deploy"

### 3. Environment Variables

Add in Vercel dashboard (Settings → Environment Variables):

```env
NEXT_PUBLIC_API_URL=https://goal-tracker-api.onrender.com/api
```

### 4. Redeploy

After adding environment variables:
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"

### 5. Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatic

Your web app will be available at:
- `https://goal-tracker-web.vercel.app`
- Or your custom domain

---

## 📱 Mobile App Deployment

### Android APK (GitHub Releases)

#### 1. Build Release APK

```bash
cd mobile

# Build APK
flutter build apk --release

# APK location:
# build/app/outputs/flutter-apk/app-release.apk
```

#### 2. Create GitHub Release

```bash
# Create release tag
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0
```

1. Go to GitHub repository
2. Click "Releases" → "Create a new release"
3. Choose tag: v1.0.0
4. Release title: "Goal Tracker v1.0.0"
5. Upload `app-release.apk`
6. Click "Publish release"

Users can download APK from GitHub Releases page.

#### 3. Enable Installation

Users need to:
1. Download APK from GitHub
2. Enable "Install from Unknown Sources" in Android settings
3. Install APK

### Google Play Store (Optional - $25 one-time fee)

#### 1. Prepare for Play Store

```bash
# Create app bundle (required for Play Store)
flutter build appbundle --release

# Bundle location:
# build/app/outputs/bundle/release/app-release.aab
```

#### 2. Create Play Console Account

1. Go to [play.google.com/console](https://play.google.com/console)
2. Pay $25 one-time registration fee
3. Complete account setup

#### 3. Create App

1. Click "Create app"
2. Fill in app details:
   - **App name:** Goal Tracker
   - **Default language:** English
   - **App or game:** App
   - **Free or paid:** Free
3. Complete all required sections:
   - Store listing
   - Content rating
   - Target audience
   - Privacy policy

#### 4. Upload App Bundle

1. Go to "Production" → "Create new release"
2. Upload `app-release.aab`
3. Add release notes
4. Review and rollout

#### 5. Review Process

- Initial review: 1-7 days
- Updates: Usually within 24 hours

---

## 🔄 CI/CD Setup (Optional)

### GitHub Actions for Backend

Create `.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy Backend to Render

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Trigger Render Deploy
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

Add `RENDER_DEPLOY_HOOK` secret in GitHub repository settings.

### GitHub Actions for Web

Create `.github/workflows/deploy-web.yml`:

```yaml
name: Deploy Web to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'web/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🔍 Monitoring & Logging

### Backend Monitoring (Render)

1. Go to Render dashboard
2. Click on your service
3. View:
   - **Logs:** Real-time application logs
   - **Metrics:** CPU, Memory, Request count
   - **Events:** Deployment history

### Web Monitoring (Vercel)

1. Go to Vercel dashboard
2. Click on your project
3. View:
   - **Analytics:** Page views, performance
   - **Logs:** Function logs
   - **Speed Insights:** Core Web Vitals

### Database Monitoring (Supabase)

1. Go to Supabase dashboard
2. View:
   - **Database:** Connection stats
   - **API:** Request count
   - **Storage:** Usage metrics

---

## 🐛 Troubleshooting

### Backend Issues

**Service won't start:**
```bash
# Check logs in Render dashboard
# Common issues:
# - Missing environment variables
# - Database connection failed
# - Port binding error
```

**Database connection timeout:**
- Check DATABASE_URL is correct
- Verify Supabase project is active
- Check connection pooling settings

**CORS errors:**
- Add Vercel domain to CORS_ORIGIN
- Redeploy backend after changes

### Web App Issues

**API calls failing:**
- Check NEXT_PUBLIC_API_URL is correct
- Verify backend is running
- Check browser console for errors

**Build failures:**
- Check all dependencies are in package.json
- Verify Node version compatibility
- Review build logs in Vercel

### Mobile App Issues

**APK won't install:**
- Enable "Unknown Sources" in Android settings
- Check APK is signed correctly
- Verify minimum SDK version

---

## 📊 Cost Optimization

### Stay Within Free Tiers

**Render:**
- Service sleeps after 15 min → Use ping service
- 750 hours/month → Enough for 24/7 with one service

**Supabase:**
- 500MB database → Archive old data
- 2GB bandwidth → Optimize queries, use pagination

**Vercel:**
- 100GB bandwidth → Optimize images, use CDN

### Upgrade Paths

When you outgrow free tiers:

**Render:** $7/month
- No sleep
- More resources

**Supabase:** $25/month
- 8GB database
- 50GB bandwidth

**Vercel:** $20/month
- 1TB bandwidth
- Advanced analytics

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables documented
- [ ] Database migrations tested
- [ ] API endpoints tested
- [ ] Security review completed

### Backend Deployment
- [ ] Supabase project created
- [ ] Database migrations run
- [ ] Render service created
- [ ] Environment variables set
- [ ] Health check passing
- [ ] CORS configured

### Web Deployment
- [ ] Repository pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Build successful
- [ ] API connection working

### Mobile Deployment
- [ ] Release APK built
- [ ] GitHub release created
- [ ] Installation tested
- [ ] API connection working

### Post-Deployment
- [ ] All features tested in production
- [ ] Monitoring set up
- [ ] Backup strategy confirmed
- [ ] Documentation updated
- [ ] Users notified

---

## 🆘 Support

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Flutter Deployment:** https://docs.flutter.dev/deployment

## 🎉 Success!

Your Goal Tracker app is now live and accessible to users worldwide - completely free!

**URLs:**
- API: `https://goal-tracker-api.onrender.com`
- Web: `https://goal-tracker-web.vercel.app`
- Mobile: GitHub Releases page