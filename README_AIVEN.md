# Database Migration to Aiven PostgreSQL

Your Evangadi Forum backend is now configured to work with Aiven PostgreSQL!

## 📁 Files Created/Modified

### New Files:

1. **`Backend/db/db_postgres.sql`** - PostgreSQL schema (converted from MySQL)
2. **`Backend/AIVEN_SETUP_GUIDE.md`** - Detailed setup instructions
3. **`Backend/QUICK_START_AIVEN.md`** - Quick 5-minute setup guide
4. **`Backend/scripts/migrate-to-aiven.js`** - Migration script to create tables

### Modified Files:

1. **`Backend/config/dbConfig.js`** - Updated to support Aiven PostgreSQL

## 🚀 Getting Started

### Option 1: Quick Start (Recommended)

Read: `Backend/QUICK_START_AIVEN.md` for a 5-minute setup guide.

### Option 2: Detailed Guide

Read: `Backend/AIVEN_SETUP_GUIDE.md` for comprehensive instructions.

## Quick Commands

```bash
# 1. Create Aiven service and get credentials
# Follow: Backend/QUICK_START_AIVEN.md

# 2. Set up .env file with Aiven credentials
# See: .env.example

# 3. Run migration to create tables
node Backend/scripts/migrate-to-aiven.js

# 4. Start your server
npm start
```

## Configuration Options

### Option A: Individual Parameters (Recommended for flexibility)

```env
AIVEN_PG_HOST=your-host.a.aivencloud.com
AIVEN_PG_PORT=5432
AIVEN_PG_DATABASE=defaultdb
AIVEN_PG_USER=avnadmin
AIVEN_PG_PASSWORD=your-password
```

### Option B: Connection String (Simpler)

```env
AIVEN_CONNECTION_STRING=postgresql://avnadmin:password@host:port/defaultdb?sslmode=require
```

## Database Schema

The PostgreSQL schema includes:

- ✅ **users** - User accounts
- ✅ **questions** - Forum questions
- ✅ **answers** - Answers to questions
- ✅ **answer_likes** - Likes on answers
- ✅ **comments** - Comments on answers

All tables include:

- Proper foreign key constraints
- Indexes for performance
- Timestamps
- Cascade delete for data integrity

## Troubleshooting

### Connection Issues

- Check `.env` file has correct credentials
- Verify Aiven service is running in console
- Ensure SSL is enabled (already configured)

### Migration Issues

- Run migration script: `node Backend/scripts/migrate-to-aiven.js`
- Check Aiven service logs
- Verify database credentials

### SSL Errors

- Aiven requires SSL connections
- `rejectUnauthorized: false` is set automatically
- This is required for cloud PostgreSQL

## Next Steps

1. ✅ Follow quick start guide
2. ✅ Run migration script
3. ✅ Test your API endpoints
4. ✅ Deploy your backend
5. ✅ Update frontend URLs if needed

## Support

- **Quick Guide**: `Backend/QUICK_START_AIVEN.md`
- **Detailed Guide**: `Backend/AIVEN_SETUP_GUIDE.md`
- **Aiven Docs**: https://docs.aiven.io/
- **Aiven Console**: https://console.aiven.io/

## Features

- ✅ Cloud-hosted PostgreSQL
- ✅ SSL encryption
- ✅ Automatic backups (depends on plan)
- ✅ Scaling support
- ✅ Monitoring dashboard
- ✅ $300 free credits

Happy coding! 🚀
