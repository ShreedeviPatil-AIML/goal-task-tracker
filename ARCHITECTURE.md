# Goal Tracker App - Architecture Document

## 🎯 Technology Stack Decision

### Backend: Node.js + Express
**Why chosen:**
- Mature ecosystem with extensive free resources
- Better integration with JavaScript-based frontend
- Excellent JWT libraries (jsonwebtoken)
- Easy Docker deployment
- Strong community support for free hosting (Render, Railway)

### Database: PostgreSQL (Supabase)
**Why chosen:**
- Supabase provides 500MB free storage + 2GB bandwidth
- Built-in authentication support
- Real-time capabilities (future feature)
- Better data integrity with relations
- Free PostgreSQL hosting with backups
- REST API auto-generation option

### Mobile: Flutter
**Why chosen:**
- Single codebase for Android (and iOS future)
- Native performance
- Beautiful Material Design widgets
- Excellent offline support with sqflite
- Smaller APK size vs React Native
- Better animation performance

### Web: Next.js 14 + Tailwind CSS
**Why chosen:**
- Server-side rendering for better SEO
- API routes for backend proxy
- Vercel free hosting (100GB bandwidth)
- Built-in optimization
- App Router for modern patterns
- Excellent developer experience

## 📊 Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    display_name VARCHAR(100),
    google_id VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);

-- Goals Table
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- health, work, learning, personal, fitness
    priority VARCHAR(20) NOT NULL, -- low, medium, high, critical
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_dates ON goals(start_date, end_date);

-- Daily Completions Table
CREATE TABLE daily_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL,
    completed BOOLEAN DEFAULT false,
    notes TEXT,
    xp_earned INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(goal_id, completion_date)
);

CREATE INDEX idx_daily_completions_goal ON daily_completions(goal_id);
CREATE INDEX idx_daily_completions_date ON daily_completions(completion_date);
CREATE INDEX idx_daily_completions_user ON daily_completions(user_id);

-- Streaks Table
CREATE TABLE streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_completion_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(goal_id)
);

CREATE INDEX idx_streaks_goal ON streaks(goal_id);
CREATE INDEX idx_streaks_user ON streaks(user_id);

-- XP History Table
CREATE TABLE xp_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
    xp_amount INTEGER NOT NULL,
    reason VARCHAR(100), -- daily_completion, streak_milestone, goal_completed
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_xp_history_user ON xp_history(user_id);
CREATE INDEX idx_xp_history_date ON xp_history(created_at);
```

## 🏗 Project Structure

```
goal-tracker/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/            # Database, JWT config
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth, validation, rate limiting
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helpers
│   │   └── app.js             # Express app
│   ├── tests/
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── web/                        # Next.js Web App
│   ├── src/
│   │   ├── app/               # App router pages
│   │   ├── components/        # React components
│   │   ├── lib/               # API client, utils
│   │   ├── hooks/             # Custom hooks
│   │   └── styles/            # Global styles
│   ├── public/
│   ├── .env.example
│   └── package.json
│
├── mobile/                     # Flutter Android App
│   ├── lib/
│   │   ├── models/            # Data models
│   │   ├── screens/           # UI screens
│   │   ├── widgets/           # Reusable widgets
│   │   ├── services/          # API service, local storage
│   │   ├── providers/         # State management
│   │   └── main.dart
│   ├── android/
│   ├── assets/
│   └── pubspec.yaml
│
├── docs/                       # Documentation
│   ├── API.md                 # API documentation
│   ├── DEPLOYMENT.md          # Deployment guide
│   └── SETUP.md               # Setup instructions
│
└── docker-compose.yml         # Local development
```

## 🔐 Security Implementation

1. **Password Security**
   - bcrypt with salt rounds: 12
   - Minimum 8 characters, 1 uppercase, 1 number

2. **JWT Authentication**
   - Access token: 15 minutes expiry
   - Refresh token: 7 days expiry
   - Stored in httpOnly cookies (web)
   - Secure storage (mobile)

3. **Rate Limiting**
   - Login: 5 attempts per 15 minutes
   - API: 100 requests per 15 minutes per IP
   - Registration: 3 attempts per hour

4. **Input Validation**
   - express-validator for all inputs
   - SQL injection prevention (parameterized queries)
   - XSS protection (sanitization)

## 🚀 API Endpoints

### Authentication
```
POST   /api/auth/register          # Email registration
POST   /api/auth/login             # Email login
POST   /api/auth/google            # Google OAuth
POST   /api/auth/refresh           # Refresh token
POST   /api/auth/logout            # Logout
GET    /api/auth/me                # Get current user
```

### Goals
```
GET    /api/goals                  # List user goals
POST   /api/goals                  # Create goal
GET    /api/goals/:id              # Get goal details
PUT    /api/goals/:id              # Update goal
DELETE /api/goals/:id              # Delete goal
GET    /api/goals/:id/progress     # Get goal progress
```

### Daily Completions
```
POST   /api/completions            # Mark day complete
GET    /api/completions/today      # Today's completions
GET    /api/completions/calendar   # Calendar heatmap data
PUT    /api/completions/:id        # Update completion
```

### Streaks
```
GET    /api/streaks                # User's all streaks
GET    /api/streaks/:goalId        # Goal streak info
```

### Analytics
```
GET    /api/analytics/weekly       # Weekly stats
GET    /api/analytics/monthly      # Monthly stats
GET    /api/analytics/export       # Export CSV
```

### User
```
GET    /api/user/profile           # Get profile
PUT    /api/user/profile           # Update profile
GET    /api/user/xp                # XP and level info
```

## 🎨 UI/UX Specifications

### Color Palette
```
Primary: #3B82F6 (Blue)
Success: #10B981 (Green)
Warning: #F59E0B (Amber)
Danger: #EF4444 (Red)
Gold: #FCD34D (Streak milestone)

Dark Mode:
Background: #0F172A
Card: #1E293B
Text: #F1F5F9

Light Mode:
Background: #F8FAFC
Card: #FFFFFF
Text: #0F172A
```

### Animations
- Goal completion: Confetti + scale animation
- Streak milestone: Gold shimmer effect
- Progress bars: Smooth fill animation (1s ease-out)
- Card hover: Lift effect (translateY -4px)
- Button press: Scale 0.95

### Typography
- Headings: Inter Bold
- Body: Inter Regular
- Numbers: JetBrains Mono (for XP/streaks)

## 📦 Free Deployment Strategy

### Backend (Render Free Tier)
- 512MB RAM
- Sleeps after 15 min inactivity
- 750 hours/month free
- Auto-deploy from GitHub

### Database (Supabase Free)
- 500MB database
- 2GB bandwidth
- Unlimited API requests
- Auto backups

### Web (Vercel Free)
- 100GB bandwidth
- Unlimited sites
- Auto SSL
- Edge functions

### Mobile
- GitHub Releases for APK
- Future: Google Play (one-time $25)

## 🔄 XP & Level System

### XP Calculation
```
Daily completion: 10 XP
3-day streak: +5 bonus XP
7-day streak: +15 bonus XP
30-day streak: +50 bonus XP
Goal completed: 100 XP
All daily goals done: +20 bonus XP
```

### Level Formula
```javascript
function calculateLevel(totalXP) {
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
}

function xpForNextLevel(currentLevel) {
  return (currentLevel * currentLevel * 100) - currentXP;
}
```

## 🧠 AI Weekly Summary (Rule-Based)

Generate summary from completion patterns:
```
- Completion rate: X%
- Best performing goal: [goal name]
- Longest streak: X days
- Total XP earned: X
- Suggested focus: [lowest completion goal]
```

## 🚀 Future Scalability

### Phase 2 (Free)
- Social features (share streaks)
- Goal templates
- Habit stacking
- Dark/Light mode sync

### Phase 3 (Optional Paid)
- Team goals
- Advanced analytics
- Custom themes
- Priority support

## 📊 Performance Targets

- API response: < 200ms (p95)
- Web FCP: < 1.5s
- Mobile app size: < 20MB
- Offline mode: Full CRUD support
- Database queries: Indexed, < 50ms

## 🔧 Development Timeline (7 Days)

**Day 1-2:** Backend API + Database setup
**Day 3-4:** Web app core features
**Day 5-6:** Mobile app development
**Day 7:** Testing, deployment, documentation