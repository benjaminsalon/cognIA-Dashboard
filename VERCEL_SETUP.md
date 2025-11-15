# Vercel Setup Guide

## Problem
Vercel serverless functions run in a read-only filesystem, so we can't write files directly. This app now uses **Vercel KV** (Redis) for storage in production.

## Solution
The app automatically detects the environment:
- **Local development**: Uses filesystem (reads/writes to `/data` folder)
- **Vercel production**: Uses Vercel KV (Redis database)

## Setup Steps

### 1. Install Dependencies
```bash
npm install @vercel/kv
# or
pnpm add @vercel/kv
```

### 2. Create Vercel KV Database

1. Go to your Vercel project dashboard
2. Navigate to **Storage** tab
3. Click **Create Database**
4. Select **KV** (Redis)
5. Give it a name (e.g., "quiz-storage")
6. Click **Create**

### 3. Link KV to Your Project

Vercel will automatically add the following environment variables:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

These are automatically available in your serverless functions.

### 4. Deploy

After setting up KV, redeploy your application:
```bash
vercel --prod
```

Or push to your main branch if you have auto-deployment enabled.

## How It Works

The storage abstraction layer (`lib/storage.ts`) automatically:
- Detects if you're on Vercel (checks for `VERCEL=1` or `KV_REST_API_URL`)
- Uses filesystem for local development
- Uses Vercel KV for production

## Testing

### Local Development
- Works with filesystem as before
- No KV setup needed locally

### Production (Vercel)
- Automatically uses KV
- All lesson data stored in Redis
- No filesystem writes needed

## API Endpoints

All endpoints work the same way:
- `/api/receive-lesson` - Save a new lesson
- `/api/get-lesson` - Get a specific lesson
- `/api/get-next-lesson` - Get next lesson to complete
- `/api/get-upcoming-lessons` - Get all upcoming lessons
- `/api/get-completed-lessons` - Get completed lessons
- `/api/mark-lesson-complete` - Mark lesson as complete
- `/api/reset-lessons` - Delete all lessons

## Migration Notes

- Existing filesystem data will continue to work locally
- On Vercel, lessons need to be re-sent via API (they'll be stored in KV)
- Completed lessons are also stored in KV on Vercel
