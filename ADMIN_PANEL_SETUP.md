# Admin Panel Setup Guide

## Overview
The admin panel allows you to view, manage, and export survey responses collected from your hotel survey form.

## Prerequisites
- Node.js 16+
- PostgreSQL database (Neon.tech is already configured in `.env`)
- npm or yarn

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
First, run the database setup script to create the necessary tables:
```bash
npm run setup-db
```

This will:
- Create the `survey_responses` table
- Create indexes for faster queries
- Set up the database schema

### 3. Run Development Server
To run both the frontend and backend simultaneously:
```bash
npm run dev:full
```

Or run them separately:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:server
```

### 4. Access the Admin Panel
- **Survey Form**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5173/admin

## Login Credentials
- **Password**: `admin123` (change this in `.env` file `ADMIN_PASSWORD`)

## Admin Panel Features

### View Survey Data
- See all collected survey responses in a table format
- Search by hotel name or email
- Sort by submission date

### Statistics
- **Total Responses**: Count of all survey submissions
- **Unique Hotels**: Number of different hotels
- **Unique Emails**: Number of unique email addresses

### Actions
- **Export CSV**: Download all survey data as CSV file
- **Refresh**: Reload the latest data
- **Delete**: Remove individual survey responses
- **Search**: Filter surveys by hotel name or email

## API Endpoints

All endpoints require `Authorization: Bearer <token>` header

### GET `/api/surveys`
Fetch all survey responses
```bash
curl -H "Authorization: Bearer admin123" http://localhost:5000/api/surveys
```

### GET `/api/surveys/stats`
Get survey statistics
```bash
curl -H "Authorization: Bearer admin123" http://localhost:5000/api/surveys/stats
```

### GET `/api/surveys/export/csv`
Download surveys as CSV
```bash
curl -H "Authorization: Bearer admin123" http://localhost:5000/api/surveys/export/csv > surveys.csv
```

### POST `/api/surveys`
Save a new survey response (called from form submission)
```bash
curl -X POST http://localhost:5000/api/surveys \
  -H "Content-Type: application/json" \
  -d '{"hotelName": "Hotel XYZ", ...}'
```

### DELETE `/api/surveys/:id`
Delete a survey response
```bash
curl -X DELETE -H "Authorization: Bearer admin123" http://localhost:5000/api/surveys/1
```

## Environment Variables

Update `.env` file with your settings:
```
DATABASE_URL=your_postgresql_connection_string
ADMIN_TOKEN=admin123
ADMIN_PASSWORD=admin123
PORT=5000
VITE_API_URL=http://localhost:5000
```

## Deployment to Vercel

### 1. Update Backend Handling
Since Vercel doesn't support long-running servers, you have two options:

**Option A: Use Vercel Functions** (Recommended)
- Convert `server.ts` to Vercel API routes
- Put files in `/api/` folder

**Option B: Use External Backend**
- Deploy backend separately (Render, Railway, Heroku, etc.)
- Update `VITE_API_URL` in environment variables

### 2. Deploy Frontend
```bash
npm run build
# Push to GitHub, connect to Vercel, auto-deploys
```

## Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` in `.env` is correct
- Check network access in Neon dashboard
- Run `npm run setup-db` again

### Admin Login Not Working
- Verify `ADMIN_PASSWORD` in `.env`
- Clear browser localStorage: `localStorage.clear()` in console
- Try password: `admin123`

### API Endpoints Not Responding
- Check backend is running: `npm run dev:server`
- Verify `VITE_API_URL` matches backend URL
- Check browser console for CORS errors

## Security Notes
⚠️ **Before Production:**
1. Change `admin123` password to a strong one
2. Use OAuth or JWT instead of simple password
3. Add rate limiting to API
4. Use HTTPS for all connections
5. Add CORS restrictions

## Support
For issues or questions, check the server logs and browser console for error messages.
