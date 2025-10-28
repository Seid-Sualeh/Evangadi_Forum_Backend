/**
 * Migration script to set up database schema on Aiven PostgreSQL
 * Run this script once after setting up your Aiven database
 *
 * Usage: node scripts/migrate-to-aiven.js
 */

require("dotenv").config();
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  host: process.env.AIVEN_PG_HOST,
  port: process.env.AIVEN_PG_PORT || 5432,
  database: process.env.AIVEN_PG_DATABASE,
  user: process.env.AIVEN_PG_USER,
  password: process.env.AIVEN_PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function migrateDatabase() {
  try {
    console.log("🚀 Starting database migration to Aiven PostgreSQL...");

    // Read the SQL file
    const sqlFile = path.join(__dirname, "../db/db_postgres.sql");
    const sql = fs.readFileSync(sqlFile, "utf8");

    // Execute the SQL
    const client = await pool.connect();
    console.log("✅ Connected to Aiven PostgreSQL");

    await client.query(sql);
    console.log("✅ Database schema created successfully!");

    // Verify tables were created
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log("\n📊 Created tables:");
    tablesResult.rows.forEach((row) => {
      console.log(`  - ${row.table_name}`);
    });

    client.release();
    console.log("\n✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
}

migrateDatabase();
