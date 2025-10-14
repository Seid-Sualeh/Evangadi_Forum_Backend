const mysql2 = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const dbConnection = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  DB_NAME: process.env.DB_NAME,
  DATABASE_URL: process.env.DATABASE_URL,
  connectionLimit:
    process.env.CONNECTION_LIMIT || process.env.DB_CONNECTION_LIMIT,
});
console.log("✅ Database connected successfully");
module.exports = dbConnection.promise();
