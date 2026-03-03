# 🎯 Goal Tracker

A production-ready goal tracking application with streaks, XP system, and beautiful UI. Built with 100% free, open-source stack.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![Flutter](https://img.shields.io/badge/flutter-3.0+-blue.svg)

## ✨ Features

- 🔐 **User Authentication** - Email + Google OAuth
- 🎯 **Goal Management** - Create, track, and manage monthly goals
- 🔥 **Streak Tracking** - Build habits with daily streaks
- ⭐ **XP & Leveling System** - Gamified progress tracking
- 📊 **Analytics Dashboard** - Weekly and monthly insights
- 📅 **Calendar Heatmap** - Visual progress tracking
- 🌓 **Dark/Light Mode** - Beautiful UI in both themes
- 📱 **Cross-Platform** - Web + Android (iOS ready)
- 💾 **Offline Support** - Work without internet (mobile)
- 📤 **Data Export** - Export your data to CSV

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL (Supabase)
- **Authentication:** JWT
- **Validation:** express-validator
- **Security:** helmet, bcrypt, rate-limiting

### Web App
- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **State:** React Hooks
- **Charts:** Recharts
- **Animations:** Framer Motion

### Mobile App
- **Framework:** Flutter 3.0+
- **State:** Provider
- **Storage:** SQLite (sqflite)
- **Charts:** fl_chart
- **HTTP:** http package

### Deployment (100% Free)
- **Backend:** Render (Free Tier)
- **Database:** Supabase (Free Tier)
- **Web:** Vercel (Free Tier)
- **Mobile:** GitHub Releases / Google Play

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (or Supabase account)
- Flutter SDK 3.0+ (for mobile)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/goal-tracker.git
cd goal-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Web App Setup

```bash
cd web
npm install
cp .env.example .env.local
# Edit .env.local with API URL
npm run dev
```

Web app runs on `http://localhost:3000`

### 4. Mobile App Setup

```bash
cd mobile
flutter pub get
flutter run
```

## 📚 Documentation

- [📖 Setup Guide](./docs/SETUP.md) - Detailed setup instructions
- [🔌 API Documentation](./docs/API.md) - Complete API reference
- [🚀 Deployment Guide](./docs/DEPLOYMENT.md) - Deploy to production
- [🏗️ Architecture](./ARCHITECTURE.md) - System design and decisions

## 🎨 Screenshots

### Web App
```
[Dashboard] [Goals] [Analytics] [Calendar]
```

### Mobile App
```
[Home] [Add Goal] [Streaks] [Profile]
```

## 📊 Database Schema

```
users
├── id (UUID)
├── email
├── password_hash
├── display_name
├── total_xp
└── level

goals
├── id (UUID)
├── user_id (FK)
├── title
├── category
├── priority
├── start_date
└── end_date

daily_completions
├── id (UUID)
├── goal_id (FK)
├── completion_date
├── completed
└── xp_earned

streaks
├── id (UUID)
├── goal_id (FK)
├── current_streak
└── longest_streak
```

## 🔐 Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT authentication with refresh tokens
- ✅ Rate limiting on all endpoints
- ✅ Input validation and sanitization
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Helmet security headers

## 🎮 XP System

### XP Rewards
- Daily completion: **10 XP**
- 3-day streak: **+5 bonus XP**
- 7-day streak: **+15 bonus XP**
- 30-day streak: **+50 bonus XP**
- Goal completed: **100 XP**
- All daily goals: **+20 bonus XP**

### Level Formula
```javascript
level = floor(sqrt(totalXP / 100)) + 1
```

## 🌟 Key Features Explained

### Streak System
- Tracks consecutive days of goal completion
- Breaks if you miss a day
- Milestone rewards at 3, 7, 30, 60, 100 days
- Visual streak flames 🔥

### Analytics
- Weekly completion rate
- Category breakdown
- Best performing goals
- Daily XP earned
- Active streak count

### Gamification
- Level up system
- XP progress bars
- Achievement milestones
- Confetti animations on completion
- Motivational messages

## 🔄 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
GET    /api/auth/me
POST   /api/auth/logout
```

### Goals
```
GET    /api/goals
POST   /api/goals
GET    /api/goals/:id
PUT    /api/goals/:id
DELETE /api/goals/:id
GET    /api/goals/:id/progress
```

### Completions
```
POST   /api/completions
GET    /api/completions/today
GET    /api/completions/calendar
```

### Analytics
```
GET    /api/analytics/weekly
GET    /api/analytics/monthly
GET    /api/analytics/export
GET    /api/analytics/xp
GET    /api/analytics/summary
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Web Tests
```bash
cd web
npm test
```

### Mobile Tests
```bash
cd mobile
flutter test
```

## 📦 Deployment

### Quick Deploy

**Backend (Render):**
```bash
# Push to GitHub, then connect to Render
# Auto-deploys on push to main
```

**Web (Vercel):**
```bash
cd web
vercel --prod
```

**Mobile (APK):**
```bash
cd mobile
flutter build apk --release
# Upload to GitHub Releases
```

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Database hosting
- [Render](https://render.com) - Backend hosting
- [Vercel](https://vercel.com) - Web hosting
- [Flutter](https://flutter.dev) - Mobile framework
- [Next.js](https://nextjs.org) - Web framework

## 📧 Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- [x] User authentication
- [x] Goal CRUD operations
- [x] Streak tracking
- [x] XP system
- [x] Basic analytics

### Phase 2 (Next)
- [ ] Social features (share streaks)
- [ ] Goal templates
- [ ] Habit stacking
- [ ] Push notifications
- [ ] iOS app

### Phase 3 (Future)
- [ ] Team goals
- [ ] Advanced analytics
- [ ] Custom themes
- [ ] AI-powered insights
- [ ] Integration with other apps

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

**Built with ❤️ using 100% free, open-source technologies**