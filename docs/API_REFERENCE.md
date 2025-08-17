# API Reference

This document provides comprehensive documentation for the Attendee Attendance Terminal REST API.

## Base URL
```
http://localhost:5000/api
```

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64b1f1a1b1234567890abcde",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "member",
    "status": "active"
  }
}
```

#### Register (Admin Only)
```http
POST /auth/register
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "rfidTag": "ABC123456",
  "phone": "+1234567890",
  "role": "member"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "64b1f1a1b1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member",
    "status": "active"
  }
}
```

#### Profile
```http
GET /auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "64b1f1a1b1234567890abcde",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "member",
  "status": "active",
  "rfidTag": "ABC123456",
  "phone": "+1234567890"
}
```

## User Management

### List Users (Admin Only)
```http
GET /users?page=1&limit=10&status=active&role=member&search=john
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status (active/inactive)
- `role` (string): Filter by role (member/admin/mentor)
- `search` (string): Search by name, email, or RFID tag

**Response:**
```json
{
  "users": [
    {
      "id": "64b1f1a1b1234567890abcde",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "member",
      "status": "active",
      "rfidTag": "ABC123456",
      "createdAt": "2023-07-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 47,
    "limit": 10
  }
}
```

### Get User by ID (Admin/Mentor)
```http
GET /users/:id
```

**Response:**
```json
{
  "id": "64b1f1a1b1234567890abcde",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "member",
  "status": "active",
  "rfidTag": "ABC123456",
  "phone": "+1234567890",
  "createdAt": "2023-07-15T10:30:00.000Z",
  "updatedAt": "2023-07-15T10:30:00.000Z"
}
```

### Update User (Admin Only)
```http
PUT /users/:id
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "phone": "+1234567890",
  "status": "active",
  "role": "member"
}
```

### Delete User (Admin Only)
```http
DELETE /users/:id
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

## Attendance Management

### Record Attendance
```http
POST /attendance
```

**Request Body:**
```json
{
  "rfidTag": "ABC123456",
  "timestamp": "2023-07-15T10:30:00.000Z"
}
```

**Response (Entry):**
```json
{
  "message": "Entry recorded successfully",
  "action": "entry",
  "attendance": {
    "id": "64b1f1a1b1234567890abcde",
    "user": "64b1f1a1b1234567890abcde",
    "date": "2023-07-15",
    "entryTime": "2023-07-15T10:30:00.000Z",
    "exitTime": null,
    "duration": null,
    "status": "present"
  },
  "user": {
    "id": "64b1f1a1b1234567890abcde",
    "name": "John Doe",
    "role": "member"
  }
}
```

**Response (Exit):**
```json
{
  "message": "Exit recorded successfully",
  "action": "exit",
  "attendance": {
    "id": "64b1f1a1b1234567890abcde",
    "user": "64b1f1a1b1234567890abcde",
    "date": "2023-07-15",
    "entryTime": "2023-07-15T10:30:00.000Z",
    "exitTime": "2023-07-15T18:45:00.000Z",
    "duration": 495,
    "status": "present"
  },
  "user": {
    "id": "64b1f1a1b1234567890abcde",
    "name": "John Doe",
    "role": "member"
  }
}
```

### Get Attendance Records
```http
GET /attendance?page=1&limit=10&date=2023-07-15&user=64b1f1a1b1234567890abcde&status=present
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `date` (string): Filter by date (YYYY-MM-DD)
- `startDate` (string): Start date range (YYYY-MM-DD)
- `endDate` (string): End date range (YYYY-MM-DD)
- `user` (string): Filter by user ID
- `status` (string): Filter by status (present/absent)

**Response:**
```json
{
  "attendance": [
    {
      "id": "64b1f1a1b1234567890abcde",
      "user": {
        "id": "64b1f1a1b1234567890abcde",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "member"
      },
      "date": "2023-07-15",
      "entryTime": "2023-07-15T10:30:00.000Z",
      "exitTime": "2023-07-15T18:45:00.000Z",
      "duration": 495,
      "status": "present"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalRecords": 25,
    "limit": 10
  }
}
```

### Get Today's Attendance
```http
GET /attendance/today
```

**Response:**
```json
{
  "date": "2023-07-15",
  "summary": {
    "totalUsers": 50,
    "presentUsers": 35,
    "absentUsers": 15,
    "presentPercentage": 70
  },
  "attendance": [
    {
      "id": "64b1f1a1b1234567890abcde",
      "user": {
        "id": "64b1f1a1b1234567890abcde",
        "name": "John Doe",
        "role": "member"
      },
      "entryTime": "2023-07-15T10:30:00.000Z",
      "exitTime": null,
      "status": "present"
    }
  ]
}
```

### Manual Attendance (Admin/Mentor)
```http
POST /attendance/manual
```

**Request Body:**
```json
{
  "userId": "64b1f1a1b1234567890abcde",
  "date": "2023-07-15",
  "entryTime": "09:00",
  "exitTime": "17:00",
  "status": "present",
  "notes": "Manual entry - sick leave documentation"
}
```

### Update Attendance (Admin/Mentor)
```http
PUT /attendance/:id
```

**Request Body:**
```json
{
  "entryTime": "2023-07-15T09:30:00.000Z",
  "exitTime": "2023-07-15T17:30:00.000Z",
  "status": "present",
  "notes": "Corrected entry time"
}
```

### Delete Attendance (Admin Only)
```http
DELETE /attendance/:id
```

## Statistics & Reports

### Dashboard Statistics
```http
GET /attendance/stats
```

**Response:**
```json
{
  "today": {
    "totalUsers": 50,
    "presentUsers": 35,
    "absentUsers": 15,
    "presentPercentage": 70
  },
  "thisWeek": {
    "averageAttendance": 75,
    "totalWorkingDays": 5,
    "topAttenders": [
      {
        "user": "John Doe",
        "attendanceRate": 100
      }
    ]
  },
  "thisMonth": {
    "averageAttendance": 78,
    "totalWorkingDays": 22,
    "attendanceTrend": [
      { "date": "2023-07-01", "percentage": 80 },
      { "date": "2023-07-02", "percentage": 75 }
    ]
  }
}
```

### User Statistics
```http
GET /attendance/stats/user/:userId?startDate=2023-07-01&endDate=2023-07-31
```

**Response:**
```json
{
  "user": {
    "id": "64b1f1a1b1234567890abcde",
    "name": "John Doe"
  },
  "period": {
    "startDate": "2023-07-01",
    "endDate": "2023-07-31"
  },
  "statistics": {
    "totalDays": 31,
    "presentDays": 22,
    "absentDays": 9,
    "attendanceRate": 71,
    "averageDuration": 480,
    "totalHours": 176
  },
  "timeline": [
    {
      "date": "2023-07-01",
      "status": "present",
      "entryTime": "09:00",
      "exitTime": "17:30",
      "duration": 510
    }
  ]
}
```

## Export Data

### Export Attendance
```http
GET /attendance/export?format=csv&startDate=2023-07-01&endDate=2023-07-31
```

**Query Parameters:**
- `format` (string): Export format (csv/xlsx/json)
- `startDate` (string): Start date (YYYY-MM-DD)
- `endDate` (string): End date (YYYY-MM-DD)
- `users` (array): Specific user IDs to include

**Response:**
```
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="attendance_2023-07-01_2023-07-31.csv"
```

## Error Responses

### Standard Error Format
```json
{
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

### Common Error Codes

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | VALIDATION_ERROR | Invalid request data |
| 401 | UNAUTHORIZED | Missing or invalid authentication |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource already exists |
| 429 | RATE_LIMIT | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 5 requests per 15 minutes
- **Attendance recording**: 10 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1625097600
```

## WebSocket Events (Real-time Updates)

The system supports real-time updates via WebSocket connections:

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events

#### Attendance Updated
```javascript
socket.on('attendance:updated', (data) => {
  console.log('New attendance record:', data);
  // data contains the full attendance record
});
```

#### User Status Changed
```javascript
socket.on('user:status_changed', (data) => {
  console.log('User status changed:', data);
  // data contains user ID and new status
});
```

#### System Alert
```javascript
socket.on('system:alert', (data) => {
  console.log('System alert:', data);
  // data contains alert type and message
});
```

## Testing

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Record Attendance:**
```bash
curl -X POST http://localhost:5000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{"rfidTag":"ABC123456"}'
```

**Get Today's Attendance:**
```bash
curl -X GET http://localhost:5000/api/attendance/today \
  -H "Authorization: Bearer your-jwt-token"
```

### Using Postman

A Postman collection is available at `/docs/postman/Attendee_API.postman_collection.json` with pre-configured requests for all endpoints.

## SDKs and Libraries

### JavaScript/Node.js
```javascript
const AttendeeAPI = require('launchlog-api-client');

const client = new AttendeeAPI({
  baseURL: 'http://localhost:5000/api',
  token: 'your-jwt-token'
});

// Record attendance
const result = await client.attendance.record('ABC123456');
```

### Python
```python
from launchlog_api import AttendeeClient

client = AttendeeClient(
    base_url='http://localhost:5000/api',
    token='your-jwt-token'
)

# Get today's attendance
attendance = client.attendance.get_today()
```

## Changelog

### v2.0.0
- Added entry/exit tracking
- Improved authentication with JWT
- Added real-time WebSocket support
- Enhanced error handling
- Added rate limiting

### v1.0.0
- Initial API release
- Basic attendance recording
- User management
- Simple authentication
