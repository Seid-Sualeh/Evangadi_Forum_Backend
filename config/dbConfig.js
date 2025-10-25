// // ====================== dbConfig.js ======================
// const { Pool } = require("pg");
// const dotenv = require("dotenv");
// dotenv.config();

// // ✅ Supabase PostgreSQL connection
// const pool = new Pool({
//   user: process.env.DB_USER || "postgres",
//   host: process.env.DB_HOST || "db.iqjwyerxcxibvlgrrnca.supabase.co",
//   database: process.env.DB_NAME || "postgres",
//   password: process.env.DB_PASS || "",
//   port: process.env.DB_PORT || 5432,
//   ssl: {
//     rejectUnauthorized: false, // Required by Supabase
//   },
// });

// // ✅ Test connection (optional)
// pool.connect((err, client, release) => {
//   if (err) {
//     console.error("❌ Error connecting to Supabase database:", err);
//     return;
//   }
//   console.log("✅ Connected to Supabase database!");
//   release();
// });

// module.exports = pool;




// dbConfig.js - SIMPLIFIED VERSION (if you need it)
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;