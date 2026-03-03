# Goal Tracker - Setup Guide

Complete setup instructions for the Goal Tracker application.

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase account recommended)
- Flutter SDK 3.0+ (for mobile app)
- Git

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in project details:
   - Name: goal-tracker
   - Database Password: (save this!)
   - Region: Choose closest to you
4. Wait for project to be created (~2 minutes)

### 2. Get Database Credentials

1. Go to Project Settings → Database
2. Copy the connection string under "Connection string"
3. Note down:
   - Host
   - Database name
   - Port
   - User
   - Password

### 3. Run Database Migrations

```bash
cd backend
cp .env.example .env
# Edit .env with your Supabase credentials
npm install
npm run migrate
```

## 🔧 Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Edit `.env` file:

```env
NODE_ENV=development
PORT=5000

# Supabase PostgreSQL Connection
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# JWT Secrets (generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# CORS (add your frontend URLs)
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### 3. Generate JWT Secrets

```bash
# Generate secure random strings
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### 5. Test API

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Goal Tracker API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 🌐 Web App Setup

### 1. Create Next.js Project

```bash
npx create-next-app@latest web --typescript --tailwind --app --no-src-dir
cd web
```

### 2. Install Dependencies

```bash
npm install axios react-hot-toast date-fns recharts
npm install -D @types/node
```

### 3. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Start Development Server

```bash
npm run dev
```

Web app will run on `http://localhost:3000`

## 📱 Mobile App Setup (Flutter)

### 1. Install Flutter

Follow official guide: https://docs.flutter.dev/get-started/install

Verify installation:
```bash
flutter doctor
```

### 2. Create Flutter Project

```bash
flutter create mobile
cd mobile
```

### 3. Add Dependencies

Edit `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  shared_preferences: ^2.2.2
  provider: ^6.1.1
  intl: ^0.18.1
  fl_chart: ^0.65.0
  sqflite: ^2.3.0
  path_provider: ^2.1.1
```

Install:
```bash
flutter pub get
```

### 4. Configure API Endpoint

Create `lib/config/api_config.dart`:

```dart
class ApiConfig {
  static const String baseUrl = 'http://10.0.2.2:5000/api'; // Android emulator
  // static const String baseUrl = 'http://localhost:5000/api'; // iOS simulator
  // static const String baseUrl = 'https://your-api.com/api'; // Production
}
```

### 5. Run on Emulator/Device

```bash
# List available devices
flutter devices

# Run on specific device
flutter run -d <device-id>

# Run on Android
flutter run -d android

# Run on Chrome (for testing)
flutter run -d chrome
```

## 🐳 Docker Setup (Optional)

### 1. Build Backend Image

```bash
cd backend
docker build -t goal-tracker-api .
```

### 2. Run with Docker Compose

Create `docker-compose.yml` in root:

```yaml
version: '3.8'

services:
  api:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
    restart: unless-stopped
```

Run:
```bash
docker-compose up -d
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

## 🔍 Troubleshooting

### Database Connection Issues

1. Check Supabase project is active
2. Verify connection string is correct
3. Ensure IP is whitelisted in Supabase (Settings → Database → Connection pooling)
4. Test connection:
   ```bash
   psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

### CORS Errors

1. Add frontend URL to `CORS_ORIGIN` in backend `.env`
2. Restart backend server
3. Clear browser cache

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Flutter Build Issues

```bash
# Clean build
flutter clean
flutter pub get

# Update Flutter
flutter upgrade
```

## 📚 Next Steps

1. Read [API Documentation](./API.md)
2. Review [Deployment Guide](./DEPLOYMENT.md)
3. Check [Architecture Document](../ARCHITECTURE.md)

## 🆘 Support

- GitHub Issues: [Create an issue](https://github.com/yourusername/goal-tracker/issues)
- Documentation: Check docs folder
- Community: Join discussions

## ✅ Verification Checklist

- [ ] Database migrations completed successfully
- [ ] Backend server running on port 5000
- [ ] Health check endpoint returns 200
- [ ] Web app running on port 3000
- [ ] Mobile app builds without errors
- [ ] Can register new user via API
- [ ] Can login and receive JWT token
- [ ] Can create a goal via API