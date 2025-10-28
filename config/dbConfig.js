const { Pool } = require("pg");
require("dotenv").config();

// Aiven PostgreSQL connection configuration
// Supports both connection string and individual parameters
let poolConfig;

// Option 1: Use connection string (simpler)
if (process.env.AIVEN_CONNECTION_STRING) {
  poolConfig = {
    connectionString: process.env.AIVEN_CONNECTION_STRING,
    ssl: {
      rejectUnauthorized: false, // Required for Aiven
    },
  };
}
// Option 2: Use individual parameters
else {
  poolConfig = {
    host: process.env.AIVEN_PG_HOST,
    port: process.env.AIVEN_PG_PORT || 5432,
    database: process.env.AIVEN_PG_DATABASE,
    user: process.env.AIVEN_PG_USER,
    password: process.env.AIVEN_PG_PASSWORD,
    ssl: {
      rejectUnauthorized: false, // Required for Aiven
    },
  };

  // Add CA certificate if provided
  if (process.env.AIVEN_CA_CERTIFICATE) {
    poolConfig.ssl.ca = process.env.AIVEN_CA_CERTIFICATE;
  }
}

const pool = new Pool(poolConfig);

// Test connection
pool
  .connect()
  .then(() => {
    console.log("✅ Connected to Aiven PostgreSQL database!");
  })
  .catch((err) => {
    console.error("❌ Aiven PostgreSQL connection error:", err);
  });

module.exports = pool;
