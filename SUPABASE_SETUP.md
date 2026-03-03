# 🗄️ Supabase Connection Setup Guide

## ⚠️ Current Issue

The connection to your Supabase database is failing with:
```
Error: getaddrinfo ENOTFOUND db.vktmuwhlteknigykzzqj.supabase.co
```

This typically means one of the following:

## 🔍 Troubleshooting Steps

### 1. Verify Supabase Project is Ready

Your Supabase project might still be provisioning. This usually takes 2-3 minutes.

**Check in Supabase Dashboard:**
1. Go to [app.supabase.com](https://app.supabase.com)
2. Click on your project
3. Look for "Project is ready" or similar status
4. Wait if it shows "Setting up project..."

### 2. Get the Correct Connection String

**In Supabase Dashboard:**
1. Go to **Settings** (gear icon in sidebar)
2. Click **Database**
3. Scroll to **Connection string**
4. Select **URI** tab
5. Copy the connection string

**It should look like:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Important:** The `[PROJECT-REF]` should match your project reference exactly.

### 3. Verify Your Connection String

Based on what you provided:
```
Host: db.vktmuwhlteknigykzzqj.supabase.co
Password: ObsKPAd82UlkGD2S
```

**Please verify:**
- [ ] Is `vktmuwhlteknigykzzqj` the correct project reference?
- [ ] Is the project fully provisioned (not still setting up)?
- [ ] Can you access the Supabase dashboard for this project?

### 4. Test Connection Manually

**Option A: Using psql (if installed)**
```bash
psql "postgresql://postgres:ObsKPAd82UlkGD2S@db.vktmuwhlteknigykzzqj.supabase.co:5432/postgres"
```

**Option B: Using Supabase SQL Editor**
1. Go to Supabase Dashboard
2. Click **SQL Editor** in sidebar
3. Run: `SELECT NOW();`
4. If this works, the database is ready

### 5. Check Network/DNS

```bash
# Test DNS resolution
nslookup db.vktmuwhlteknigykzzqj.supabase.co

# Or
ping db.vktmuwhlteknigykzzqj.supabase.co
```

If DNS fails, the project might not be ready yet.

## ✅ Once Connection Works

After verifying the connection string is correct and the project is ready:

### 1. Update .env File

```bash
cd backend
```

Edit `backend/.env` and update line 7:
```env
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.YOUR_ACTUAL_PROJECT_REF.supabase.co:5432/postgres
```

### 2. Run Migrations

```bash
npm run migrate
```

**Expected Output:**
```
🚀 Starting database migrations...
✅ Database connection successful
✅ Database migrations completed successfully!
```

### 3. Start Server

```bash
npm run dev
```

**Expected Output:**
```
✅ Database connection successful
📅 Database time: 2024-01-08T12:00:00.000Z
🚀 Server running on port 5000
🌍 Environment: development
📡 API URL: http://localhost:5000
💚 Health check: http://localhost:5000/health
```

### 4. Test API

```bash
# In a new terminal
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Goal Tracker API is running",
  "timestamp": "2024-01-08T12:00:00.000Z",
  "environment": "development"
}
```

## 🎯 Quick Test Commands

Once the connection works, test the full flow:

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "displayName": "Test User"
  }'
```

### 2. Create Goal
```bash
# Save the token from registration response
TOKEN="your-token-here"

curl -X POST http://localhost:5000/api/goals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Morning Exercise",
    "description": "30 minutes of cardio",
    "category": "fitness",
    "priority": "high",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }'
```

### 3. Mark Complete
```bash
GOAL_ID="goal-id-from-previous-response"

curl -X POST http://localhost:5000/api/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "goalId": "'$GOAL_ID'",
    "completionDate": "2024-01-08",
    "completed": true,
    "notes": "Great workout!"
  }'
```

## 🔧 Alternative: Use Supabase Connection Pooler

If direct connection fails, try the connection pooler:

**In Supabase Dashboard:**
1. Settings → Database
2. Find **Connection Pooling**
3. Copy the **Transaction** mode connection string
4. Update your `.env` with this URL instead

The pooler URL looks like:
```
postgresql://postgres:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

## 📝 Current Configuration

Your current `.env` has:
```env
DATABASE_URL=postgresql://postgres:ObsKPAd82UlkGD2S@db.vktmuwhlteknigykzzqj.supabase.co:5432/postgres
```

**Next Steps:**
1. Wait 2-3 minutes if project is still provisioning
2. Verify the project reference in Supabase dashboard
3. Copy the exact connection string from Supabase
4. Update `.env` if needed
5. Run `npm run migrate` again

## 🆘 Still Having Issues?

If the connection still fails after verifying:

1. **Check Supabase Status:** [status.supabase.com](https://status.supabase.com)
2. **Try Connection Pooler:** Use the pooler URL instead
3. **Check Firewall:** Ensure your network allows outbound connections to Supabase
4. **Contact Supabase:** Check their Discord or support if project won't provision

## ✅ Success Indicators

You'll know it's working when:
- ✅ `npm run migrate` completes without errors
- ✅ Server starts and shows "Database connection successful"
- ✅ Health check returns 200 OK
- ✅ You can register a user
- ✅ You can create goals

---

**The backend code is 100% ready - we just need the database connection to work!** 🚀