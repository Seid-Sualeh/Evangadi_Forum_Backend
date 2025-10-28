# Aiven PostgreSQL Setup Guide

This guide will help you deploy your Evangadi Forum database to Aiven PostgreSQL.

## Step 1: Create Aiven Account

1. Go to [Aiven Console](https://console.aiven.io/)
2. Sign up for a free account (if you don't have one)
3. You'll get $300 free credits to start with

## Step 2: Create PostgreSQL Service

1. Log in to your Aiven Console
2. Click **"Create Service"** or the **"+"** button
3. Select **PostgreSQL**
4. Configure your service:

   - **Service name**: `evangadi-forum-db` (or any name you prefer)
   - **Cloud provider**: Choose one (AWS, Azure, GCP)
   - **Region**: Select the closest region to your app
   - **Plan**: Start with the **`1GB RAM, 10GB disk`** plan (free tier compatible)
   - **PostgreSQL version**: Latest stable version (recommended: 15 or 16)

5. Click **"Create Service"** (takes 2-5 minutes)

## Step 3: Get Connection Details

Once your service is created:

1. Open your service in Aiven Console
2. Go to the **"Overview"** tab
3. You'll see the connection details:

   - **Host**
   - **Port** (usually 5432)
   - **Database**
   - **Username**
   - **Password**

4. Go to the **"SSL** tab to get the CA certificate (optional but recommended)

## Step 4: Download SSL Certificate (Recommended)

1. In your Aiven service, click on **"SSL"** tab
2. Copy the **CA certificate** content
3. Save it as `ca-cert.pem` in your `Backend/` folder (optional)

## Step 5: Set Up Environment Variables

Create a `.env` file in your `Backend/` directory if you don't have one:

```bash
# Aiven PostgreSQL Configuration
AIVEN_PG_HOST=your-service.a.aivencloud.com
AIVEN_PG_PORT=5432
AIVEN_PG_DATABASE=defaultdb
AIVEN_PG_USER=avnadmin
AIVEN_PG_PASSWORD=your-password-here
AIVEN_CA_CERTIFICATE="-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"
```

Or use connection string format:

```bash
# Alternative: Use full connection string
AIVEN_CONNECTION_STRING=postgresql://avnadmin:your-password@your-service.a.aivencloud.com:5432/defaultdb?sslmode=require
```

## Step 6: Create Database Schema

### Option 1: Using psql (Command Line)

```bash
# Connect to your Aiven database
psql "postgresql://avnadmin:your-password@your-service.a.aivencloud.com:5432/defaultdb?sslmode=require"

# Run the schema file
\i Backend/db/db_postgres.sql
```

### Option 2: Using pgAdmin or Database Tool

1. Connect to your Aiven database using any PostgreSQL client
2. Run the contents of `Backend/db/db_postgres.sql`

### Option 3: Using Node.js Script

Create a migration script (see `Backend/scripts/migrate-to-aiven.js` below)

## Step 7: Update Your Application

Update your `.env` file with the Aiven credentials, then restart your server:

```bash
npm start
```

## Step 8: Test the Connection

Your application will automatically test the connection on startup. You should see:

```
✅ Connected to Aiven PostgreSQL database!
```

## Troubleshooting

### Connection Issues

- **SSL Error**: Make sure `ssl.rejectUnauthorized` is set to `false`
- **Timeout**: Check your firewall settings
- **Authentication Error**: Verify your credentials in the .env file

### Aiven Console Tips

- **Connection information**: Found in "Overview" tab
- **SSL certificate**: Found in "SSL" tab
- **Monitoring**: Check "Monitoring" tab for usage and performance
- **Logs**: Check "Logs" tab for database logs
- **Service restart**: Available in "Service settings"

## Alternative: Using Connection String

If you prefer using a connection string, update `Backend/config/dbConfig.js`:

```javascript
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.AIVEN_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool
  .connect()
  .then(() => {
    console.log("✅ Connected to Aiven PostgreSQL database!");
  })
  .catch((err) => {
    console.error("❌ Connection error:", err);
  });

module.exports = pool;
```

## Free Tier Limits

Aiven free tier typically includes:

- $300 credit
- Basic database service
- Enough for development and small production use
- Can upgrade anytime

## Support

- [Aiven Documentation](https://docs.aiven.io/)
- [Aiven Support](https://aiven.io/support)
