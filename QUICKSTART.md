# 🚀 Goal Tracker - Quick Start Guide

Get your Goal Tracker app running in under 10 minutes!

## ⚡ Fast Track Setup

### Step 1: Database (2 minutes)

1. Go to [supabase.com](https://supabase.com) → Sign up
2. Create new project: "goal-tracker"
3. Copy connection string from Settings → Database
4. Save password securely

### Step 2: Backend (3 minutes)

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=your-supabase-connection-string
JWT_SECRET=run-this-command-below
JWT_REFRESH_SECRET=run-this-command-below
```

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run migrations and start:
```bash
npm run migrate
npm run dev
```

✅ Backend running at `http://localhost:5000`

### Step 3: Test Backend (1 minute)

```bash
curl http://localhost:5000/health
```

Should return:
```json
{"success": true, "message": "Goal Tracker API is running"}
```

### Step 4: Web App (2 minutes)

```bash
# In new terminal
cd web
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start:
```bash
npm run dev
```

✅ Web app running at `http://localhost:3000`

### Step 5: Mobile App (2 minutes)

```bash
# In new terminal
cd mobile
flutter pub get
flutter run
```

✅ Mobile app running on emulator/device

## 🎯 First Steps

### 1. Register Account

**Web:**
- Open `http://localhost:3000`
- Click "Sign Up"
- Enter email and password
- Click "Create Account"

**API:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "displayName": "Test User"
  }'
```

### 2. Create First Goal

**API:**
```bash
# Save token from registration response
TOKEN="your-jwt-token"

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

### 3. Mark as Complete

```bash
curl -X POST http://localhost:5000/api/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "goalId": "goal-uuid-from-previous-response",
    "completionDate": "2024-01-08",
    "completed": true,
    "notes": "Great workout!"
  }'
```

## 🎨 What You Get

### Backend Features ✅
- User authentication (JWT)
- Goal CRUD operations
- Daily completion tracking
- Streak calculation
- XP and leveling system
- Weekly/monthly analytics
- CSV export

### Web App (To Build)
- Dashboard with goals
- Progress visualization
- Calendar heatmap
- Analytics charts
- Dark/light mode
- Responsive design

### Mobile App (To Build)
- Native Android UI
- Offline support
- Push notifications
- Smooth animations
- Material Design

## 📁 Project Structure

```
goal-tracker/
├── backend/              ✅ COMPLETE
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth, validation
│   │   ├── config/       # Database setup
│   │   └── utils/        # Helpers (XP, JWT)
│   └── package.json
│
├── web/                  🚧 TO BUILD
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # React components
│   │   └── lib/          # API client
│   └── package.json
│
├── mobile/               🚧 TO BUILD
│   ├── lib/
│   │   ├── screens/      # UI screens
│   │   ├── widgets/      # Reusable widgets
│   │   └── services/     # API service
│   └── pubspec.yaml
│
└── docs/                 ✅ COMPLETE
    ├── SETUP.md
    ├── API.md
    └── DEPLOYMENT.md
```

## 🧪 Test the API

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","displayName":"Test"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

### Get Goals
```bash
curl http://localhost:5000/api/goals \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Analytics
```bash
curl http://localhost:5000/api/analytics/weekly \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎯 Next Steps

### For Web Development:
1. Create Next.js app: `npx create-next-app@latest web`
2. Install dependencies: `npm install axios react-hot-toast`
3. Build components:
   - Login/Register forms
   - Dashboard with goal cards
   - Goal creation modal
   - Progress charts
   - Calendar heatmap

### For Mobile Development:
1. Create Flutter app: `flutter create mobile`
2. Add dependencies in `pubspec.yaml`
3. Build screens:
   - Login/Register
   - Home (goal list)
   - Add/Edit goal
   - Analytics
   - Profile

### For Deployment:
1. Push code to GitHub
2. Deploy backend to Render
3. Deploy web to Vercel
4. Build APK for mobile

## 📚 Resources

- **Backend API:** [docs/API.md](./docs/API.md)
- **Full Setup:** [docs/SETUP.md](./docs/SETUP.md)
- **Deployment:** [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)

## 🐛 Common Issues

### Database Connection Failed
```bash
# Check Supabase project is active
# Verify DATABASE_URL is correct
# Test connection:
psql "your-database-url"
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### JWT Token Invalid
```bash
# Regenerate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Update .env and restart server
```

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Database migrations successful
- [ ] Backend health check returns 200
- [ ] Can register new user
- [ ] Can login and get JWT token
- [ ] Can create a goal
- [ ] Can mark goal as complete
- [ ] Streak tracking works
- [ ] XP system awards points
- [ ] Analytics endpoint returns data

## 🎉 Success!

You now have a fully functional Goal Tracker backend API!

**What's Working:**
- ✅ User authentication with JWT
- ✅ Goal management (CRUD)
- ✅ Daily completion tracking
- ✅ Streak calculation with bonuses
- ✅ XP and leveling system
- ✅ Weekly/monthly analytics
- ✅ CSV data export
- ✅ Rate limiting and security
- ✅ Input validation
- ✅ Error handling

**Ready to Build:**
- 🚧 Web frontend (Next.js + Tailwind)
- 🚧 Mobile app (Flutter)
- 🚧 UI animations and polish
- 🚧 Deployment to production

## 💡 Pro Tips

1. **Use Postman:** Import API collection for easy testing
2. **Check Logs:** Monitor backend logs for errors
3. **Database GUI:** Use Supabase dashboard to view data
4. **Hot Reload:** Backend auto-reloads with nodemon
5. **Environment:** Keep `.env` file secure, never commit it

## 🆘 Need Help?

1. Check documentation in `docs/` folder
2. Review API examples in `docs/API.md`
3. Look at backend code for implementation details
4. Test endpoints with curl or Postman
5. Check Supabase dashboard for database issues

---

**Time to build the frontend! 🚀**