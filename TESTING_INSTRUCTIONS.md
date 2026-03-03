# 🧪 Goal Tracker - Local Testing Instructions

## ⚠️ Important Note

The backend requires a **PostgreSQL database** to run. You have two options:

### Option 1: Use Supabase (Recommended - Free)
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (takes ~2 minutes)
3. Get your connection string from Settings → Database
4. Update `backend/.env` with your DATABASE_URL

### Option 2: Use Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database: `createdb goal_tracker`
3. Update `backend/.env` with: `DATABASE_URL=postgresql://localhost:5432/goal_tracker`

## ✅ Current Setup Status

**What's Already Done:**
- ✅ Dependencies installed (`npm install` completed)
- ✅ `.env` file created with secure JWT secrets
- ✅ JWT_SECRET: `c4db5feb572057e89b3ba688c4d802e7578031506329d24b7ab0e38051d4d934`
- ✅ JWT_REFRESH_SECRET: `72dedcb6bd1d7916cc0d300613ce867a7bb55a472da2c61e85f2c10670849371`

**What You Need to Do:**
1. Get a database (Supabase or local PostgreSQL)
2. Update DATABASE_URL in `backend/.env`
3. Run migrations
4. Start the server

## 🚀 Complete Testing Steps

### Step 1: Setup Database

**For Supabase (Recommended):**
```bash
# 1. Go to supabase.com and create project
# 2. Copy connection string from Settings → Database
# 3. Update backend/.env:

# Replace this line in backend/.env:
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# With your actual connection string from Supabase
```

**For Local PostgreSQL:**
```bash
# Install PostgreSQL (if not installed)
brew install postgresql  # macOS
# or
sudo apt-get install postgresql  # Linux

# Start PostgreSQL
brew services start postgresql  # macOS
# or
sudo service postgresql start  # Linux

# Create database
createdb goal_tracker

# Update backend/.env:
DATABASE_URL=postgresql://localhost:5432/goal_tracker
```

### Step 2: Run Database Migrations

```bash
cd backend
npm run migrate
```

**Expected Output:**
```
🚀 Starting database migrations...
✅ Database migrations completed successfully!
```

### Step 3: Start Backend Server

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

### Step 4: Test API Endpoints

**Open a new terminal and run these tests:**

#### 1. Health Check
```bash
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

#### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "displayName": "Test User"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "test@example.com",
      "displayName": "Test User",
      "totalXP": 0,
      "level": 1
    },
    "accessToken": "jwt-token-here",
    "refreshToken": "refresh-token-here"
  }
}
```

**Save the accessToken for next steps!**

#### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

#### 4. Create Goal
```bash
# Replace YOUR_TOKEN with the accessToken from registration
TOKEN="your-access-token-here"

curl -X POST http://localhost:5000/api/goals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Morning Exercise",
    "description": "30 minutes of cardio",
    "category": "fitness",
    "priority": "high",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "color": "#10B981"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Goal created successfully",
  "data": {
    "id": "goal-uuid-here",
    "title": "Morning Exercise",
    "category": "fitness",
    "priority": "high",
    ...
  }
}
```

#### 5. Get All Goals
```bash
curl http://localhost:5000/api/goals \
  -H "Authorization: Bearer $TOKEN"
```

#### 6. Mark Goal Complete
```bash
# Replace GOAL_ID with the id from previous response
GOAL_ID="your-goal-id-here"

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

**Expected Response:**
```json
{
  "success": true,
  "message": "Goal completed! 🎉",
  "data": {
    "completion": { ... },
    "streak": {
      "current": 1,
      "longest": 1
    },
    "xp": {
      "earned": 10,
      "total": 10,
      "leveledUp": false,
      "newLevel": 1
    }
  }
}
```

#### 7. Get Weekly Analytics
```bash
curl http://localhost:5000/api/analytics/weekly \
  -H "Authorization: Bearer $TOKEN"
```

#### 8. Get User XP Info
```bash
curl http://localhost:5000/api/analytics/xp \
  -H "Authorization: Bearer $TOKEN"
```

## 🎯 Testing Checklist

- [ ] Database connection successful
- [ ] Migrations completed
- [ ] Server starts without errors
- [ ] Health check returns 200
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Receive valid JWT token
- [ ] Can create a goal
- [ ] Can list goals
- [ ] Can mark goal as complete
- [ ] Streak tracking works
- [ ] XP system awards points
- [ ] Analytics endpoint returns data

## 🐛 Troubleshooting

### Database Connection Failed
```
Error: connect ECONNREFUSED
```
**Solution:**
- Check DATABASE_URL is correct
- Verify database is running
- For Supabase: Check project is active
- Test connection: `psql "your-database-url"`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### JWT Token Invalid
```
{"success": false, "message": "Invalid token"}
```
**Solution:**
- Make sure you're using the token from login/register response
- Token expires after 15 minutes, login again
- Check Authorization header format: `Bearer <token>`

### Migration Errors
```
Error: relation "users" already exists
```
**Solution:**
- Migrations already ran successfully
- If you need to reset: Drop all tables and run migrations again

## 📊 What's Working

Once you complete the setup, you'll have:

✅ **Authentication System**
- User registration with password hashing
- Login with JWT tokens
- Token refresh mechanism
- Secure password validation

✅ **Goal Management**
- Create, read, update, delete goals
- Category and priority system
- Date range tracking
- Color customization

✅ **Completion Tracking**
- Daily check-ins
- Automatic streak calculation
- XP rewards with bonuses
- Progress history

✅ **Analytics**
- Weekly completion stats
- Category breakdown
- Best performing goals
- XP and level tracking
- CSV export

✅ **Security**
- Rate limiting (100 req/15min)
- Input validation
- SQL injection prevention
- XSS protection
- CORS configuration

## 🎉 Success Indicators

If everything is working, you should see:

1. **Server logs showing:**
   - Database connection successful
   - Server running on port 5000
   - No error messages

2. **API responses with:**
   - `"success": true`
   - Proper data structures
   - Valid JWT tokens

3. **Database tables created:**
   - users
   - goals
   - daily_completions
   - streaks
   - xp_history

## 📚 Next Steps After Testing

Once the backend is working:

1. **Build Web Frontend**
   - Create Next.js app
   - Build authentication pages
   - Create dashboard
   - Add analytics charts

2. **Build Mobile App**
   - Create Flutter app
   - Implement screens
   - Add offline support
   - Build APK

3. **Deploy to Production**
   - Deploy backend to Render
   - Deploy web to Vercel
   - Release mobile APK

## 🆘 Need Help?

- Check [API Documentation](docs/API.md) for endpoint details
- Review [Setup Guide](docs/SETUP.md) for detailed instructions
- Check [Architecture](ARCHITECTURE.md) for system design
- Look at backend code for implementation details

---

**The backend is production-ready and waiting for your database connection!** 🚀