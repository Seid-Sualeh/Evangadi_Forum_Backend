# Quick Start: Deploy to Aiven PostgreSQL

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Aiven Service

1. Go to https://console.aiven.io/
2. Sign up/Login
3. Click **"Create Service"** → Choose **PostgreSQL**
4. Fill in:
   - Service name: `evangadi-forum`
   - Plan: `1GB RAM, 10GB disk` (free tier)
   - Cloud & Region: Choose closest to you
5. Click **"Create Service"** (wait 2-5 minutes)

### Step 2: Get Credentials

Once created, go to **"Overview"** tab and copy:

- Host
- Port
- Database
- Username
- Password

### Step 3: Configure Your App

Create `.env` file in `Backend/` folder:

```env
AIVEN_PG_HOST=your-service.a.aivencloud.com
AIVEN_PG_PORT=5432
AIVEN_PG_DATABASE=defaultdb
AIVEN_PG_USER=avnadmin
AIVEN_PG_PASSWORD=your-actual-password

PORT=5001
JWT_SECRET=your-secret-key
NODE_ENV=production
```

### Step 4: Run Migration

```bash
cd Backend
node scripts/migrate-to-aiven.js
```

You should see:

```
✅ Connected to Aiven PostgreSQL
✅ Database schema created successfully!
📊 Created tables:
  - users
  - questions
  - answers
  - answer_likes
  - comments
```

### Step 5: Start Your Server

```bash
npm start
```

You should see:

```
✅ Connected to Aiven PostgreSQL database!
🚀 Server running on port 5001
```

## ✅ Done!

Your database is now hosted on Aiven PostgreSQL. Check `AIVEN_SETUP_GUIDE.md` for detailed information.

## Need Help?

- Aiven Setup Guide: `Backend/AIVEN_SETUP_GUIDE.md`
- Aiven Docs: https://docs.aiven.io/
- Check logs in Aiven Console if something goes wrong
