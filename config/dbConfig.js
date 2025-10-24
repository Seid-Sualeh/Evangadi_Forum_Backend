// dbConfig.js
const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

// ✅ Correct connection configuration for Supabase
const pool = new Pool({
  user: process.env.DB_USER || "postgres",               // Supabase DB user
  host: process.env.DB_HOST || "db.iqjwyerxcxibvlgrrnca.supabase.co", // Supabase host
  database: process.env.DB_NAME || "postgres",          // Supabase database
  password: process.env.DB_PASS || "",                  // Supabase password
  port: process.env.DB_PORT || 5432,                   // default PostgreSQL port
  ssl: {
    rejectUnauthorized: false,                          // required for Supabase
  },
});

// ✅ Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Error connecting to Supabase database:", err);
    return;
  }
  console.log(" Connected to Supabase database!");
  release();
});

module.exports = pool;
