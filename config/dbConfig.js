const { Pool } = require("pg");
require("dotenv").config();

// ✅ Neon database connection
const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: {
    rejectUnauthorized: false, // required for Neon
  },
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Error connecting to Neon database:", err);
  } else {
    console.log("✅ Connected to Neon database!");
    release();
  }
});

module.exports = pool;

