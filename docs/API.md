# Goal Tracker API Documentation

Complete API reference for the Goal Tracker backend.

**Base URL:** `http://localhost:5000/api` (development)

**Authentication:** JWT Bearer token in Authorization header or cookie

## 📑 Table of Contents

- [Authentication](#authentication)
- [Goals](#goals)
- [Completions](#completions)
- [Analytics](#analytics)
- [Error Handling](#error-handling)

---

## Authentication

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Rate Limit:** 3 requests per hour per IP

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "displayName": "John Doe"
}
```

**Validation:**
- Email: Valid email format
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
- Display Name: 2-100 characters (optional)

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "displayName": "John Doe",
      "totalXP": 0,
      "level": 1
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

---

### Login

Authenticate user and receive tokens.

**Endpoint:** `POST /auth/login`

**Rate Limit:** 5 attempts per 15 minutes per IP

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "displayName": "John Doe",
      "avatarUrl": null,
      "totalXP": 150,
      "level": 2
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

---

### Refresh Token

Get new access token using refresh token.

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-token"
  }
}
```

---

### Get Current User

Get authenticated user's profile.

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "avatarUrl": null,
    "totalXP": 150,
    "level": 2,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Logout

Logout user (client should delete tokens).

**Endpoint:** `POST /auth/logout`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Goals

### List Goals

Get all goals for authenticated user.

**Endpoint:** `GET /goals`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `active` (optional): Filter by active status (true/false)
- `category` (optional): Filter by category (health, work, learning, personal, fitness)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Morning Exercise",
      "description": "30 minutes of cardio",
      "category": "fitness",
      "priority": "high",
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "isActive": true,
      "color": "#10B981",
      "currentStreak": 7,
      "longestStreak": 15,
      "completedDays": 45,
      "totalDays": 60,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Single Goal

Get details of a specific goal.

**Endpoint:** `GET /goals/:id`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Morning Exercise",
    "description": "30 minutes of cardio",
    "category": "fitness",
    "priority": "high",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "isActive": true,
    "color": "#10B981",
    "currentStreak": 7,
    "longestStreak": 15,
    "lastCompletionDate": "2024-01-07",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Create Goal

Create a new goal.

**Endpoint:** `POST /goals`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "title": "Morning Exercise",
  "description": "30 minutes of cardio",
  "category": "fitness",
  "priority": "high",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "color": "#10B981"
}
```

**Validation:**
- Title: Required, max 255 chars
- Description: Optional, max 1000 chars
- Category: One of: health, work, learning, personal, fitness
- Priority: One of: low, medium, high, critical
- Start Date: ISO 8601 date
- End Date: ISO 8601 date, must be after start date
- Color: Optional, hex color code

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Goal created successfully",
  "data": {
    "id": "uuid",
    "title": "Morning Exercise",
    "description": "30 minutes of cardio",
    "category": "fitness",
    "priority": "high",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "isActive": true,
    "color": "#10B981",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Update Goal

Update an existing goal.

**Endpoint:** `PUT /goals/:id`

**Headers:** `Authorization: Bearer {token}`

**Request Body:** (all fields optional)
```json
{
  "title": "Evening Exercise",
  "priority": "medium",
  "isActive": false
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Goal updated successfully",
  "data": {
    "id": "uuid",
    "title": "Evening Exercise",
    "description": "30 minutes of cardio",
    "category": "fitness",
    "priority": "medium",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "isActive": false,
    "color": "#10B981",
    "updatedAt": "2024-01-08T00:00:00.000Z"
  }
}
```

---

### Delete Goal

Delete a goal and all associated data.

**Endpoint:** `DELETE /goals/:id`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Goal deleted successfully"
}
```

---

### Get Goal Progress

Get completion history for a goal.

**Endpoint:** `GET /goals/:id/progress`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-07",
      "completed": true,
      "notes": "Great workout!",
      "xpEarned": 15
    },
    {
      "date": "2024-01-06",
      "completed": true,
      "notes": null,
      "xpEarned": 10
    }
  ]
}
```

---

## Completions

### Create/Update Completion

Mark a goal as completed for a specific date.

**Endpoint:** `POST /completions`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "goalId": "uuid",
  "completionDate": "2024-01-08",
  "completed": true,
  "notes": "Felt great today!"
}
```

**Response:** `201 Created` or `200 OK`
```json
{
  "success": true,
  "message": "Goal completed! 🎉",
  "data": {
    "completion": {
      "id": "uuid",
      "goalId": "uuid",
      "userId": "uuid",
      "completionDate": "2024-01-08",
      "completed": true,
      "notes": "Felt great today!",
      "xpEarned": 15,
      "createdAt": "2024-01-08T00:00:00.000Z"
    },
    "streak": {
      "current": 8,
      "longest": 15,
      "milestone": "⭐ 7-day streak! You're on fire!"
    },
    "xp": {
      "earned": 15,
      "total": 165,
      "leveledUp": false,
      "newLevel": 2
    }
  }
}
```

---

### Get Today's Completions

Get all completions for today.

**Endpoint:** `GET /completions/today`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "goalId": "uuid",
      "goalTitle": "Morning Exercise",
      "category": "fitness",
      "color": "#10B981",
      "priority": "high",
      "completed": true,
      "notes": "Great workout!",
      "xpEarned": 15,
      "completionDate": "2024-01-08"
    }
  ]
}
```

---

### Get Calendar Data

Get completion data for calendar heatmap.

**Endpoint:** `GET /completions/calendar`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `startDate`: ISO 8601 date (required)
- `endDate`: ISO 8601 date (required)

**Example:** `GET /completions/calendar?startDate=2024-01-01&endDate=2024-01-31`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-08",
      "completedCount": 3,
      "totalCount": 4,
      "totalXP": 35,
      "intensity": 0.75
    }
  ]
}
```

---

## Analytics

### Get Weekly Analytics

Get detailed analytics for the past 7 days.

**Endpoint:** `GET /analytics/weekly`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "summary": {
      "completedTasks": 18,
      "totalTasks": 21,
      "completionRate": 86,
      "totalXP": 195
    },
    "dailyBreakdown": [
      {
        "date": "2024-01-08",
        "completed": 3,
        "total": 3,
        "xp": 35
      }
    ],
    "categoryBreakdown": [
      {
        "category": "fitness",
        "completed": 7,
        "total": 7,
        "rate": 100
      }
    ],
    "bestGoal": {
      "id": "uuid",
      "title": "Morning Exercise",
      "category": "fitness",
      "completionRate": 100
    },
    "activeStreaks": [
      {
        "goalTitle": "Morning Exercise",
        "currentStreak": 8,
        "longestStreak": 15
      }
    ]
  }
}
```

---

### Get Monthly Analytics

Get summary analytics for the past 30 days.

**Endpoint:** `GET /analytics/monthly`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "completedTasks": 75,
    "totalTasks": 90,
    "completionRate": 83,
    "totalXP": 850,
    "activeDays": 28
  }
}
```

---

### Export Data

Export all completion data as CSV.

**Endpoint:** `GET /analytics/export`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK` (CSV file)
```csv
Goal Title,Category,Priority,Date,Completed,Notes,XP Earned
"Morning Exercise",fitness,high,2024-01-08,Yes,"Great workout!",15
```

---

### Get User XP Info

Get detailed XP and level information.

**Endpoint:** `GET /analytics/xp`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "currentLevel": 2,
    "totalXP": 165,
    "xpInCurrentLevel": 65,
    "xpNeededForLevel": 400,
    "xpToNextLevel": 235,
    "progressPercentage": 16
  }
}
```

---

### Get Weekly Summary

Get AI-generated (rule-based) weekly summary.

**Endpoint:** `GET /analytics/summary`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "summary": "📊 Weekly Summary\n\n✅ Completion Rate: 86%\n🎯 Tasks Completed: 18/21\n⭐ XP Earned: 195\n\n🏆 Best Performing: Morning Exercise (100%)\n📈 Needs Focus: Reading (60%)\n\n💪 Outstanding work! You're crushing your goals!",
    "stats": {
      "completionRate": 86,
      "completedTasks": 18,
      "totalTasks": 21,
      "totalXP": 195
    }
  }
}
```

---

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

### Common Errors

**Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

**Token Expired:**
```json
{
  "success": false,
  "message": "Token expired",
  "code": "TOKEN_EXPIRED"
}
```

**Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

**Rate Limit:**
```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

---

## Rate Limits

- **General API:** 100 requests per 15 minutes
- **Login:** 5 attempts per 15 minutes
- **Registration:** 3 attempts per hour

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## Postman Collection

Import this collection to test the API:

```json
{
  "info": {
    "name": "Goal Tracker API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

Save this as `goal-tracker-postman.json` and import into Postman.