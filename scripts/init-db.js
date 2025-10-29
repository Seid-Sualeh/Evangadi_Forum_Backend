// const fs = require("fs");
// const path = require("path");
// const mysql2 = require("mysql2/promise");
// require("dotenv").config();

// async function getConnection() {
//   const useUri = !!process.env.MYSQL_ADDON_URI;
//   const isClever =
//     useUri || !!process.env.MYSQL_ADDON_HOST || !!process.env.MYSQL_ADDON_DB;

//   const sslOption = isClever
//     ? {
//         rejectUnauthorized:
//           (process.env.DB_SSL_REJECT_UNAUTHORIZED || "false").toLowerCase() ===
//           "true",
//       }
//     : undefined;

//   if (useUri) {
//     // Pass URI as first argument; options as second
//     return await mysql2.createConnection(process.env.MYSQL_ADDON_URI, {
//       ssl: sslOption,
//       multipleStatements: true,
//     });
//   }

//   return await mysql2.createConnection({
//     host: process.env.MYSQL_ADDON_HOST || process.env.DB_HOST ,
//     user: process.env.MYSQL_ADDON_USER || process.env.DB_USER,
//     password: process.env.MYSQL_ADDON_PASSWORD || process.env.DB_PASS,
//     database: process.env.MYSQL_ADDON_DB || process.env.DB_DATABASE,
//     port: Number(process.env.MYSQL_ADDON_PORT || process.env.DB_PORT ),
//     ssl: sslOption,
//     multipleStatements: true,
//   });
// }

// async function run() {
//   const sqlPath = path.join(__dirname, "..", "db", "db.sql");
//   const raw = fs.readFileSync(sqlPath, "utf8");

//   // Strip BOM
//   let sql = raw.replace(/^\uFEFF/, "");
//   // Remove block comments /* ... */
//   sql = sql.replace(/\/\*[\s\S]*?\*\//g, "");
//   // Remove single-line comments starting with -- (must be at line start or preceded by newline)
//   sql = sql.replace(/(^|\n)\s*--.*(?=\n|$)/g, "$1");

//   // Split on semicolons that end statements
//   const statements = sql
//     .split(/;\s*\n|;\s*$/gm)
//     .map((s) => s.trim())
//     .filter((s) => s.length > 0);

//   const connection = await getConnection();
//   try {
//     for (let i = 0; i < statements.length; i++) {
//       const stmt = statements[i];
//       try {
//         await connection.query(stmt);
//       } catch (e) {
//         console.error(
//           `❌ Error in statement ${i + 1}:`,
//           stmt.slice(0, 120) + (stmt.length > 120 ? "..." : "")
//         );
//         throw e;
//       }
//     }
//     console.log("✅ Database schema applied successfully.");
//   } finally {
//     await connection.end();
//   }
// }

// run().catch((err) => {
//   console.error("❌ Failed to apply database schema:", err.message);
//   process.exit(1);
// });
