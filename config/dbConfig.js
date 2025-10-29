const mysql2 = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

// Prefer Clever Cloud's MySQL addon env vars if present; otherwise fall back to local .env
const isCleverCloud =
  !!process.env.MYSQL_ADDON_URI || !!process.env.MYSQL_ADDON_HOST;

// Build configuration object or use URI directly
const connectionConfig = process.env.MYSQL_ADDON_URI
  ? process.env.MYSQL_ADDON_URI
  : {
      host: process.env.MYSQL_ADDON_HOST || process.env.DB_HOST || "localhost",
      user: process.env.MYSQL_ADDON_USER || process.env.DB_USER,
      password:
        process.env.MYSQL_ADDON_PASSWORD || process.env.DB_PASS || undefined,
      database:
        process.env.MYSQL_ADDON_DB || process.env.DB_DATABASE || undefined,
      port: Number(process.env.MYSQL_ADDON_PORT || process.env.DB_PORT || 3306),
      waitForConnections: true,
      connectionLimit: Number(
        process.env.DB_CONNECTION_LIMIT || process.env.CONNECTION_LIMIT || 10
      ),
      queueLimit: 0,
      // Clever Cloud MySQL usually requires SSL
      ssl: isCleverCloud
        ? {
            // Set to 'false' to skip CA verification if no CA bundle is provided
            rejectUnauthorized:
              (
                process.env.DB_SSL_REJECT_UNAUTHORIZED || "false"
              ).toLowerCase() === "true",
          }
        : undefined,
    };

const dbConnection = mysql2.createPool(connectionConfig);

module.exports = dbConnection.promise();
