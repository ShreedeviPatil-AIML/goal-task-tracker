# 🚀 Goal Tracker Deployment Guide

This guide will help you deploy the Goal Tracker application so your team can access it online.

## 📋 Overview

We'll deploy:
- **Backend**: Render.com (Free tier)
- **Database**: Supabase (Free tier)
- **Frontend**: Netlify (Free tier)

Total cost: **$0/month** ✨

---

## Step 1: Set Up Supabase Database (5 minutes)

### 1.1 Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email

### 1.2 Create New Project
1. Click "New Project"
2. Fill in:
   - **Name**: `goal-tracker`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your location
3. Click "Create new project" (takes ~2 minutes)

### 1.3 Run Database Setup
1. In Supabase dashboard, click "SQL Editor" (left sidebar)
2. Click "New Query"
3. Open the file [`database-setup.sql`](database-setup.sql) in your project
4. Copy the ENTIRE contents of that file
5. Paste into the Supabase SQL editor
6. Click "Run" or press Cmd/Ctrl + Enter
7. You should see a success message and a table showing 5 tables created

**Or copy this SQL:**
```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create streaks table
CREATE TABLE IF NOT EXISTS streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_completion_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(goal_id)
);

-- Create daily_completions table
CREATE TABLE IF NOT EXISTS daily_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL,
    completed BOOLEAN DEFAULT false,
    notes TEXT,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(goal_id, completion_date)
);

-- Create xp_history table
CREATE TABLE IF NOT EXISTS xp_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
    xp_amount INTEGER NOT NULL,
    reason VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_goal_id ON streaks(goal_id);
CREATE INDEX IF NOT EXISTS idx_daily_completions_goal_id ON daily_completions(goal_id);
CREATE INDEX IF NOT EXISTS idx_daily_completions_date ON daily_completions(completion_date);
CREATE INDEX IF NOT EXISTS idx_xp_history_user_id ON xp_history(user_id);
```

### 1.4 Get Connection String
1. In Supabase dashboard, click "Project Settings" (gear icon)
2. Click "Database" in left sidebar
3. Scroll to "Connection string"
4. Select "URI" tab
5. Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@...`)
6. Replace `[YOUR-PASSWORD]` with your actual database password
7. **Save this connection string** - you'll need it for Render!

---

## Step 2: Deploy Backend to Render.com (10 minutes)

### 2.1 Prepare for Deployment
1. Make sure you have a GitHub account
2. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/goal-tracker.git
   git push -u origin main
   ```

### 2.2 Create Render Account
1. Go to [render.com](https://render.com)
2. Click "Get Started"
3. Sign up with GitHub (recommended)

### 2.3 Create Web Service
1. Click "New +" button (top right)
2. Select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `goal-tracker-api`
   - **Region**: Choose closest to your location
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### 2.4 Add Environment Variables
Click "Advanced" and add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `DATABASE_URL` | Your Supabase connection string from Step 1.4 |
| `JWT_SECRET` | Generate a random string (e.g., use: `openssl rand -base64 32`) |
| `JWT_EXPIRES_IN` | `7d` |

### 2.5 Deploy
1. Click "Create Web Service"
2. Wait for deployment (takes 3-5 minutes)
3. Once deployed, copy your backend URL (e.g., `https://goal-tracker-api.onrender.com`)

---

## Step 3: Deploy Frontend to Netlify (5 minutes)

### 3.1 Update Frontend Configuration
1. Open `web/index.html`
2. Find line with `const API_URL = 'http://localhost:5000/api';`
3. Replace with your Render backend URL:
   ```javascript
   const API_URL = 'https://goal-tracker-api.onrender.com/api';
   ```
4. Save the file
5. Commit and push:
   ```bash
   git add web/index.html
   git commit -m "Update API URL for production"
   git push
   ```

### 3.2 Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Click "Sign up"
3. Sign up with GitHub (recommended)

### 3.3 Deploy Site
1. Click "Add new site" → "Import an existing project"
2. Choose "Deploy with GitHub"
3. Select your repository
4. Configure:
   - **Branch**: `main`
   - **Base directory**: `web`
   - **Build command**: (leave empty)
   - **Publish directory**: `.` (just a dot)
5. Click "Deploy site"

### 3.4 Get Your URL
1. Wait for deployment (takes 1-2 minutes)
2. Your site will be live at: `https://random-name-12345.netlify.app`
3. You can customize this URL:
   - Click "Site settings"
   - Click "Change site name"
   - Enter: `your-team-goal-tracker`
   - Your new URL: `https://your-team-goal-tracker.netlify.app`

---

## Step 4: Test Your Deployment ✅

1. Open your Netlify URL in a browser
2. Create a test account
3. Create a test goal
4. Add a daily note
5. Check if everything works!

---

## 🎉 Share With Your Team!

Send your team the Netlify URL: `https://your-team-goal-tracker.netlify.app`

Each team member should:
1. Open the link
2. Click "Create Account"
3. Sign up with their email
4. Start tracking their goals!

---

## 🔒 Security Notes

- Each user has their own private account
- Goals and data are private per user
- Passwords are securely hashed
- JWT tokens expire after 7 days
- All connections use HTTPS

---

## 💰 Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| Supabase | Free tier | $0/month |
| Render.com | Free tier | $0/month |
| Netlify | Free tier | $0/month |
| **Total** | | **$0/month** |

**Free tier limits:**
- Supabase: 500MB database, 2GB bandwidth
- Render: 750 hours/month (enough for 24/7)
- Netlify: 100GB bandwidth, unlimited sites

---

## 🆘 Troubleshooting

### Backend won't start
- Check environment variables are set correctly
- Verify DATABASE_URL is correct
- Check Render logs for errors

### Frontend can't connect to backend
- Verify API_URL in `web/index.html` matches your Render URL
- Check CORS settings in backend
- Open browser console for error messages

### Database connection fails
- Verify Supabase connection string
- Check if database password is correct
- Ensure tables were created successfully

---

## 📞 Need Help?

If you encounter issues:
1. Check Render logs (Dashboard → Logs)
2. Check browser console (F12 → Console)
3. Verify all environment variables
4. Ensure database tables exist in Supabase

---

## 🔄 Updating Your Deployment

When you make changes:

1. **Backend changes:**
   ```bash
   git add backend/
   git commit -m "Update backend"
   git push
   ```
   Render will auto-deploy in ~3 minutes

2. **Frontend changes:**
   ```bash
   git add web/
   git commit -m "Update frontend"
   git push
   ```
   Netlify will auto-deploy in ~1 minute

---

## 🎯 Next Steps

- Customize the site name on Netlify
- Set up custom domain (optional)
- Monitor usage in Supabase/Render dashboards
- Invite your team members!

**Congratulations! Your Goal Tracker is now live! 🚀**