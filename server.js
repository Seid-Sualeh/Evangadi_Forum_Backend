// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io");

// // App setup
// const app = express();
// const port = process.env.PORT || 5000;

// // Middleware
// const authMiddleware = require("./middleware/authMiddleware");
// const dbConnection = require("./config/dbConfig"); // MySQL pool
// const userRoutes = require("./routes/userRoutes");
// const questionRoutes = require("./routes/questionRoute");
// const answerRoutes = require("./routes/answerRoute");
// const aiRoutes = require("./routes/ai");
// const commentRoutes = require("./routes/commentRoutes");
// const likeRoutes = require("./routes/likeRoutes");

// app.use(
//   cors({
//     origin: ["http://localhost:5173"],
//     credentials: true,
//   })
// );

// // To handle preflight requests
// app.options("*", cors());

// // Parse JSON
// app.use(express.json());

// // Default route
// app.get("/", authMiddleware, (req, res) => {
//   res
//     .status(200)
//     .send("Welcome to Evangadi AI Forum Backend! You are authenticated.");
// });

// // Routes
// app.use("/api/v1/user", userRoutes);
// app.use("/api/v1", questionRoutes);
// app.use("/api/v1", answerRoutes);
// app.use("/api/v1/ai", aiRoutes);
// app.use("/api/v1", commentRoutes);
// app.use("/api/v1", likeRoutes);

// // ======================== SOCKET.IO SETUP ========================
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173"],
//     credentials: true,
//   },
// });

// let onlineUsers = new Set();

// io.on("connection", (socket) => {
//   onlineUsers.add(socket.id);
//   io.emit("onlineUsers", onlineUsers.size);

//   socket.on("disconnect", () => {
//     onlineUsers.delete(socket.id);
//     io.emit("onlineUsers", onlineUsers.size);
//   });
// });

// // ======================== CREATE TABLES ========================
// // async function createTables() {
// //   try {
// //     const sql = `
// //     -- Users table
// //     CREATE TABLE IF NOT EXISTS users (
// //       userid INT AUTO_INCREMENT PRIMARY KEY,
// //       username VARCHAR(50) NOT NULL,
// //       firstname VARCHAR(255) DEFAULT NULL,
// //       lastname VARCHAR(255) DEFAULT NULL,
// //       email VARCHAR(100) NOT NULL UNIQUE,
// //       password VARCHAR(255) DEFAULT NULL,
// //       createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
// //       reset_token VARCHAR(255) DEFAULT NULL,
// //       reset_expires BIGINT DEFAULT NULL,
// //       google_id VARCHAR(255) DEFAULT NULL,
// //       UNIQUE KEY uk_users_username (username)
// //     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

// //     -- Questions table
// //     CREATE TABLE IF NOT EXISTS questions (
// //       questionid INT AUTO_INCREMENT PRIMARY KEY,
// //       userid INT NOT NULL,
// //       title VARCHAR(255) NOT NULL,
// //       description TEXT NOT NULL,
// //       createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
// //       views INT DEFAULT 0,
// //       answer_count INT DEFAULT 0,
// //       question_uuid VARCHAR(36) NOT NULL UNIQUE,
// //       FOREIGN KEY (userid) REFERENCES users(userid)
// //         ON DELETE CASCADE ON UPDATE CASCADE
// //     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

// //     -- Answers table
// //     CREATE TABLE IF NOT EXISTS answers (
// //       answerid INT AUTO_INCREMENT PRIMARY KEY,
// //       userid INT NOT NULL,
// //       questionid INT NOT NULL,
// //       answer TEXT NOT NULL,
// //       createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
// //       comment_count INT DEFAULT 0,
// //       FOREIGN KEY (userid) REFERENCES users(userid)
// //         ON DELETE CASCADE ON UPDATE CASCADE,
// //       FOREIGN KEY (questionid) REFERENCES questions(questionid)
// //         ON DELETE CASCADE ON UPDATE CASCADE
// //     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

// //     -- Answer Likes table
// //     CREATE TABLE IF NOT EXISTS answer_likes (
// //       likeid INT AUTO_INCREMENT PRIMARY KEY,
// //       answerid INT NOT NULL,
// //       userid INT NOT NULL,
// //       createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
// //       FOREIGN KEY (answerid) REFERENCES answers(answerid)
// //         ON DELETE CASCADE ON UPDATE CASCADE,
// //       FOREIGN KEY (userid) REFERENCES users(userid)
// //         ON DELETE CASCADE ON UPDATE CASCADE
// //     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
// //     `;

// //     await dbConnection.query(sql);
// //     console.log("✅ All tables created successfully");
// //   } catch (err) {
// //     console.error("❌ Error creating tables:", err.message);
// //   }
// // }
// const sqlStatements = [
//   `CREATE TABLE IF NOT EXISTS users (
//     userid INT AUTO_INCREMENT PRIMARY KEY,
//     username VARCHAR(50) NOT NULL,
//     firstname VARCHAR(255) DEFAULT NULL,
//     lastname VARCHAR(255) DEFAULT NULL,
//     email VARCHAR(100) NOT NULL UNIQUE,
//     password VARCHAR(255) DEFAULT NULL,
//     createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     reset_token VARCHAR(255) DEFAULT NULL,
//     reset_expires BIGINT DEFAULT NULL,
//     google_id VARCHAR(255) DEFAULT NULL,
//     UNIQUE KEY uk_users_username (username)
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

//   `CREATE TABLE IF NOT EXISTS questions (
//     questionid INT AUTO_INCREMENT PRIMARY KEY,
//     userid INT NOT NULL,
//     title VARCHAR(255) NOT NULL,
//     description TEXT NOT NULL,
//     createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//     views INT DEFAULT 0,
//     answer_count INT DEFAULT 0,
//     question_uuid VARCHAR(36) NOT NULL UNIQUE,
//     FOREIGN KEY (userid) REFERENCES users(userid)
//       ON DELETE CASCADE ON UPDATE CASCADE
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

//   `CREATE TABLE IF NOT EXISTS answers (
//     answerid INT AUTO_INCREMENT PRIMARY KEY,
//     userid INT NOT NULL,
//     questionid INT NOT NULL,
//     answer TEXT NOT NULL,
//     createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//     comment_count INT DEFAULT 0,
//     FOREIGN KEY (userid) REFERENCES users(userid)
//       ON DELETE CASCADE ON UPDATE CASCADE,
//     FOREIGN KEY (questionid) REFERENCES questions(questionid)
//       ON DELETE CASCADE ON UPDATE CASCADE
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

//   `CREATE TABLE IF NOT EXISTS answer_likes (
//     likeid INT AUTO_INCREMENT PRIMARY KEY,
//     answerid INT NOT NULL,
//     userid INT NOT NULL,
//     createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (answerid) REFERENCES answers(answerid)
//       ON DELETE CASCADE ON UPDATE CASCADE,
//     FOREIGN KEY (userid) REFERENCES users(userid)
//       ON DELETE CASCADE ON UPDATE CASCADE
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
// ];

// for (const stmt of sqlStatements) {
//   await dbConnection.query(stmt);
// }
// console.log("✅ All tables created successfully");

// // ======================== START SERVER ========================
// async function start() {
//   try {
//     await dbConnection.query("SELECT 1"); // test connection
//     console.log("✅ Database connected successfully");

//     // Create tables before starting the server
//     await createTables();

//     server.listen(port, () => {
//       console.log(`🚀 Server running on port ${port}`);
//     });
//   } catch (err) {
//     console.error("❌ Database connection failed:", err.message);
//   }
// }

// start();


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// App setup
const app = express();
const port = process.env.PORT || 5000;

// Middleware
const authMiddleware = require("./middleware/authMiddleware");
const dbConnection = require("./config/dbConfig"); // MySQL pool

// Routes
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoute");
const answerRoutes = require("./routes/answerRoute");
const aiRoutes = require("./routes/ai");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");

// ======================== CORS ========================
const allowedOrigins = [
  "http://localhost:5173",
  "https://seidforum.vercel.app",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.options("*", cors());

// ======================== JSON PARSER ========================
app.use(express.json());

// ======================== DEFAULT ROUTE ========================
// Public root and health endpoints (no auth) for uptime checks
app.get("/", (req, res) => {
  res.status(200).send("✅ Evangadi Forum Backend is running fine!");
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", time: new Date().toISOString() });
});

// ======================== API ROUTES ========================
app.use("/api/v1/user", userRoutes);
app.use("/api/v1", questionRoutes);
app.use("/api/v1", answerRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);

// ======================== SOCKET.IO SETUP ========================
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

let onlineUsers = new Set();

io.on("connection", (socket) => {
  onlineUsers.add(socket.id);
  io.emit("onlineUsers", onlineUsers.size);

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.id);
    io.emit("onlineUsers", onlineUsers.size);
  });
});

// ======================== CREATE TABLES ========================
async function createTables() {
  try {
    const sqlStatements = [
      `CREATE TABLE IF NOT EXISTS users (
        userid INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        firstname VARCHAR(255) DEFAULT NULL,
        lastname VARCHAR(255) DEFAULT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) DEFAULT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        reset_token VARCHAR(255) DEFAULT NULL,
        reset_expires BIGINT DEFAULT NULL,
        google_id VARCHAR(255) DEFAULT NULL,
        UNIQUE KEY uk_users_username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS questions (
        questionid INT AUTO_INCREMENT PRIMARY KEY,
        userid INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        views INT DEFAULT 0,
        answer_count INT DEFAULT 0,
        question_uuid VARCHAR(36) NOT NULL UNIQUE,
        FOREIGN KEY (userid) REFERENCES users(userid)
          ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS answers (
        answerid INT AUTO_INCREMENT PRIMARY KEY,
        userid INT NOT NULL,
        questionid INT NOT NULL,
        answer TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        comment_count INT DEFAULT 0,
        FOREIGN KEY (userid) REFERENCES users(userid)
          ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (questionid) REFERENCES questions(questionid)
          ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS answer_likes (
        likeid INT AUTO_INCREMENT PRIMARY KEY,
        answerid INT NOT NULL,
        userid INT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (answerid) REFERENCES answers(answerid)
          ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (userid) REFERENCES users(userid)
          ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      // ✅ NEW COMMENTS TABLE
      `CREATE TABLE IF NOT EXISTS comments (
        commentid INT AUTO_INCREMENT PRIMARY KEY,
        answerid INT NOT NULL,
        userid INT NOT NULL,
        comment TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (answerid) REFERENCES answers(answerid)
          ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (userid) REFERENCES users(userid)
          ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
    ];

    for (const stmt of sqlStatements) {
      await dbConnection.query(stmt);
    }

    console.log("✅ All tables created successfully (with comments table)");
  } catch (err) {
    console.error("❌ Error creating tables:", err.message);
  }
}


// ======================== START SERVER ========================
async function startServer() {
  try {
    await dbConnection.query("SELECT 1"); // test DB connection
    console.log("✅ Database connected successfully");

    await createTables(); // create tables before server starts

    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
}

startServer();
