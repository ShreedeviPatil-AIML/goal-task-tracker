# ⚡ Quick Deploy Checklist

Follow these steps in order to deploy your Goal Tracker app in ~20 minutes.

## ✅ Pre-Deployment Checklist

- [ ] Code is working locally
- [ ] You have a GitHub account
- [ ] Code is pushed to GitHub repository

---

## 🗄️ Step 1: Database (5 min)

### Supabase Setup
1. ✅ Go to [supabase.com](https://supabase.com) → Sign up
2. ✅ Create new project: `goal-tracker`
3. ✅ Save your database password!
4. ✅ Go to SQL Editor → New Query
5. ✅ Open `database-setup.sql` file and copy ALL contents
6. ✅ Paste into Supabase SQL editor and click "Run"
7. ✅ Verify 5 tables were created successfully
8. ✅ Go to Settings → Database → Copy connection string
9. ✅ Replace `[YOUR-PASSWORD]` with your actual password
10. ✅ Save this connection string somewhere safe!

**Your connection string looks like:**
```
postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres
```

---

## 🖥️ Step 2: Backend (10 min)

### Render.com Setup
1. ✅ Go to [render.com](https://render.com) → Sign up with GitHub
2. ✅ Click "New +" → "Web Service"
3. ✅ Connect your GitHub repository
4. ✅ Configure:
   - Name: `goal-tracker-api`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. ✅ Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<your-supabase-connection-string>
   JWT_SECRET=<generate-random-string>
   JWT_EXPIRES_IN=7d
   ```
6. ✅ Click "Create Web Service"
7. ✅ Wait for deployment (~3-5 min)
8. ✅ Copy your backend URL: `https://goal-tracker-api.onrender.com`

**Generate JWT_SECRET:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use any random string generator
```

---

## 🌐 Step 3: Frontend (5 min)

### Update API URL
1. ✅ Open `web/index.html`
2. ✅ Find line 485: `const API_URL = 'http://localhost:5000/api';`
3. ✅ Replace with: `const API_URL = 'https://YOUR-RENDER-URL.onrender.com/api';`
4. ✅ Save and commit:
   ```bash
   git add web/index.html
   git commit -m "Update API URL for production"
   git push
   ```

### Netlify Setup
1. ✅ Go to [netlify.com](https://netlify.com) → Sign up with GitHub
2. ✅ Click "Add new site" → "Import an existing project"
3. ✅ Choose GitHub → Select your repository
4. ✅ Configure:
   - Base directory: `web`
   - Build command: (leave empty)
   - Publish directory: `.`
5. ✅ Click "Deploy site"
6. ✅ Wait for deployment (~1-2 min)
7. ✅ Copy your site URL: `https://random-name.netlify.app`
8. ✅ (Optional) Customize site name in Site Settings

---

## 🧪 Step 4: Test (2 min)

1. ✅ Open your Netlify URL
2. ✅ Create a test account
3. ✅ Create a test goal
4. ✅ Add a daily note
5. ✅ Verify everything works!

---

## 🎉 Step 5: Share!

**Your app is live!** Share this URL with your team:
```
https://your-site-name.netlify.app
```

Each team member should:
1. Open the link
2. Click "Create Account"
3. Sign up with their email
4. Start tracking goals!

---

## 🔧 Troubleshooting

### "Cannot connect to server"
- ✅ Check if backend is running on Render
- ✅ Verify API_URL in `web/index.html` is correct
- ✅ Check browser console for errors (F12)

### "Database connection failed"
- ✅ Verify DATABASE_URL in Render environment variables
- ✅ Check Supabase connection string is correct
- ✅ Ensure password in connection string is correct

### "Login not working"
- ✅ Check Render logs for errors
- ✅ Verify JWT_SECRET is set
- ✅ Clear browser cache and try again

---

## 📊 Monitor Your App

- **Backend logs**: Render Dashboard → Your Service → Logs
- **Database**: Supabase Dashboard → Table Editor
- **Frontend**: Netlify Dashboard → Site → Deploys

---

## 🔄 Making Updates

After making changes:

```bash
# Commit and push
git add .
git commit -m "Your update message"
git push

# Render and Netlify will auto-deploy!
```

---

## 💡 Tips

- ✅ Bookmark your Render, Supabase, and Netlify dashboards
- ✅ Save all URLs and credentials in a password manager
- ✅ Monitor free tier usage in each dashboard
- ✅ Set up custom domain (optional, costs ~$12/year)

---

## 📞 Need Help?

Refer to the detailed [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) for more information.

**Happy Deploying! 🚀**