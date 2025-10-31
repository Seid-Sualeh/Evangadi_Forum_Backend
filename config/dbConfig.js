// config/dbConfig.js
const mysql2 = require("mysql2");
require("dotenv").config();

// Detect Clever Cloud environment
const isCleverCloud =
  !!process.env.MYSQL_ADDON_URI || !!process.env.MYSQL_ADDON_HOST;

// Build configuration object or use URI directly
const connectionConfig = process.env.MYSQL_ADDON_URI
  ? process.env.MYSQL_ADDON_URI
  : {
      host: process.env.MYSQL_ADDON_HOST || process.env.DB_HOST,
      user: process.env.MYSQL_ADDON_USER || process.env.DB_USER,
      password: process.env.MYSQL_ADDON_PASSWORD || process.env.DB_PASS,
      database: process.env.MYSQL_ADDON_DB || process.env.DB_DATABASE,
      port: Number(process.env.MYSQL_ADDON_PORT || 3306),
      waitForConnections: true,
      connectionLimit: Number(
        process.env.DB_CONNECTION_LIMIT || process.env.CONNECTION_LIMIT || 10
      ),
      queueLimit: 0,
      ssl: isCleverCloud
        ? {
            rejectUnauthorized:
              (
                process.env.DB_SSL_REJECT_UNAUTHORIZED || "false"
              ).toLowerCase() === "true",
          }
        : undefined,
    };

// Create MySQL pool
const dbConnection = mysql2.createPool(connectionConfig);

// Export promise-based pool
module.exports = dbConnection.promise();








// const mysql = require("mysql2");

// // Create connection pool
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "mohamed",
//   password: process.env.DB_PASS || "mohammed",
//   database: process.env.DB_DATABASE || "myForum",
//   connectionLimit: process.env.DB_CONNECTION_LIMIT || 20,
//   waitForConnections: true,
//   queueLimit: 0,
//   enableKeepAlive: true,
//   keepAliveInitialDelay: 0,
// });

// // Convert to promise-based
// const promisePool = pool.promise();

// // Test connection
// async function testConnection() {
//   try {
//     const connection = await promisePool.getConnection();
//     console.log("✅ Database connected successfully");
//     connection.release();
//     return true;
//   } catch (error) {
//     console.error("❌ Database connection failed:", error.message);
//     return false;
//   }
// }

// module.exports = {
//   pool: promisePool,
//   testConnection,
// };