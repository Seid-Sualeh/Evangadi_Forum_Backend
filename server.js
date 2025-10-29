// // // server.js
// // require("dotenv").config();
// // const express = require("express");
// // const cors = require("cors");
// // const http = require("http");
// // const { Server } = require("socket.io");













// // // Initialize Express app
// // const app = express();
// // const port = process.env.PORT || 5000;

// // // ----------------- Middleware -----------------
// // app.use(
// //   cors({
// //     origin: ["http://localhost:5173"], // frontend origin
// //     credentials: true,
// //   })
// // );
// // app.use(express.json());

// // // ----------------- Supabase Client -----------------
// // const { createClient } = require("@supabase/supabase-js");

// // const supabase = createClient(
// //   process.env.SUPABASE_URL || "https://iqjwyerxcxibvlgrrnca.supabase.co",
// //   process.env.SUPABASE_ANON_KEY ||
// //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxand5ZXJ4Y3hpYnZsZ3JybmNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMTk1MTAsImV4cCI6MjA3Njg5NTUxMH0.wIci350uOsJx6WnNLefGcYi8qm1VjpJfTsHBOHSbcsg"
// // );




// // // CORS configuration - ADD YOUR NETLIFY DOMAIN
// // const allowedOrigins = [
// //   'https://seidforum.netlify.app', // Your Netlify domain
// //   'http://localhost:3000',         // Local development
// //   'http://localhost:3001'          // Alternative local port
// // ];

// // app.use(cors({
// //   origin: function (origin, callback) {
// //     // Allow requests with no origin (like mobile apps or curl requests)
// //     if (!origin) return callback(null, true);
    
// //     if (allowedOrigins.indexOf(origin) === -1) {
// //       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
// //       return callback(new Error(msg), false);
// //     }
// //     return callback(null, true);
// //   },
// //   credentials: true,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// // }));

// // // Handle preflight requests
// // app.options('*', cors());

// // // Your routes here...
// // app.get('/api/health', (req, res) => {
// //   res.json({ message: 'CORS is configured properly!' });
// // });

// // // ... rest of your routes



// // // Test Supabase connection
// // async function testSupabase() {
// //   const { data, error } = await supabase.from("questions").select("*").limit(1);
// //   if (error) {
// //     console.error("❌ Supabase connection error:", error);
// //   } else {
// //     console.log("✅ Supabase connected successfully!");
// //   }
// // }
// // testSupabase();

// // // ----------------- Routes -----------------
// // // Import routes
// // const userRoutes = require("./routes/userRoutes");
// // const questionRoutes = require("./routes/questionRoute");
// // const answerRoutes = require("./routes/answerRoute");
// // const aiRoutes = require("./routes/ai");
// // const commentRoutes = require("./routes/commentRoutes");
// // const likeRoutes = require("./routes/likeRoutes");

// // // Mount routes
// // app.use("/api/v1/user", userRoutes);
// // app.use("/api/v1", questionRoutes);
// // app.use("/api/v1", answerRoutes);
// // app.use("/api/v1/ai", aiRoutes);
// // app.use("/api/v1", commentRoutes);
// // app.use("/api/v1", likeRoutes);

// // // Default route
// // app.get("/", (req, res) => {
// //   res.status(200).send("Welcome to Evangadi AI Forum Backend!");
// // });

// // // ----------------- HTTP + Socket.IO -----------------
// // const server = http.createServer(app);
// // const io = new Server(server, {
// //   cors: {
// //     origin: ["http://localhost:5173"],
// //     credentials: true,
// //   },
// // });

// // // Track online users
// // let onlineUsers = new Set();

// // io.on("connection", (socket) => {
// //   console.log("🔗 User connected:", socket.id);
// //   onlineUsers.add(socket.id);

// //   io.emit("onlineUsers", onlineUsers.size);

// //   socket.on("disconnect", () => {
// //     console.log("❌ User disconnected:", socket.id);
// //     onlineUsers.delete(socket.id);

// //     io.emit("onlineUsers", onlineUsers.size);
// //   });
// // });

// // // ----------------- Start Server -----------------
// // server.listen(port, () => {
// //   console.log(`🚀 Server running on port ${port}`);
// // });







// // server.js - REPLACE THE ENTIRE CORS SECTION
// require("dotenv").config();


// const express = require("express");
// const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const port = process.env.PORT || 5001;

// // ✅ CORS CONFIGURATION
// const allowedOrigins = [
//   "https://seidforum.vercel.app",
//   "https://seidforum.netlify.app",
//   "http://localhost:3000",
//   "http://localhost:3001",
//   "http://localhost:5173",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (!allowedOrigins.includes(origin)) {
//         console.log("🚫 Blocked by CORS:", origin);
//         return callback(new Error("CORS not allowed"), false);
//       }
//       console.log("✅ Allowed by CORS:", origin);
//       return callback(null, true);
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//   })
// );

// app.options("*", cors());
// app.use(express.json());

// // Test route
// app.get("/api/health", (req, res) => {
//   res.json({
//     message: "CORS configured!",
//     timestamp: new Date().toISOString(),
//   });
// });

// // ----------------- DB -----------------
// const pool = require("./config/dbConfig");

// // ----------------- Routes -----------------
// const userRoutes = require("./routes/userRoutes");
// const questionRoutes = require("./routes/questionRoute");
// const answerRoutes = require("./routes/answerRoute");
// const commentRoutes = require("./routes/commentRoutes");
// const likeRoutes = require("./routes/likeRoutes");
// const aiRoutes = require("./routes/ai");

// // Mount routes
// app.use("/api/v1/user", userRoutes);
// app.use("/api/v1", questionRoutes);
// app.use("/api/v1", answerRoutes);
// app.use("/api/v1/comments", commentRoutes);
// app.use("/api/v1/likes", likeRoutes);
// app.use("/api/v1/ai", aiRoutes);

// // Default route
// app.get("/", (req, res) =>
//   res.status(200).send("Welcome to Evangadi AI Forum Backend!")
// );

// // ----------------- Socket.IO -----------------
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: allowedOrigins, credentials: true },
// });

// let onlineUsers = new Set();
// io.on("connection", (socket) => {
//   console.log("🔗 User connected:", socket.id);
//   onlineUsers.add(socket.id);
//   io.emit("onlineUsers", onlineUsers.size);

//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//     onlineUsers.delete(socket.id);
//     io.emit("onlineUsers", onlineUsers.size);
//   });
// });

// // ----------------- Start Server -----------------
// server.listen(port, "0.0.0.0", () => {
//   console.log(`🚀 Server running on port ${port}`);
//   console.log("✅ CORS enabled for:", allowedOrigins);
// });




require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5001;

// ----------------- CORS CONFIGURATION -----------------
const allowedOrigins = [
  "https://seidforum.vercel.app",
  "https://seidforum.netlify.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        console.log("🚫 Blocked by CORS:", origin);
        return callback(new Error("CORS not allowed"), false);
      }
      console.log("✅ Allowed by CORS:", origin);
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.options("*", cors());
app.use(express.json());

// ----------------- Aiven PostgreSQL Connection -----------------
const pool = new Pool({
  user: process.env.PG_USER || "avnadmin",
  host:
    process.env.PG_HOST ,
   
  database: process.env.PG_DATABASE ,
  password: process.env.PG_PASSWORD ,
  port: process.env.PG_PORT || 20105,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000, // Increased to 20 seconds
});

// ----------------- Test Database Connection -----------------
const testConnection = async () => {
  try {
    const result = await pool.query("SELECT version()");
    console.log("✅ Connected to Aiven PostgreSQL successfully!");
    console.log("📊 PostgreSQL Version:", result.rows[0].version);
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
};

testConnection();

// ----------------- Create Tables -----------------
// const createTables = async () => {
//   try {
//     // Users table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         userid SERIAL PRIMARY KEY,
//         username VARCHAR(50) NOT NULL,
//         firstname VARCHAR(255),
//         lastname VARCHAR(255),
//         email VARCHAR(50) NOT NULL UNIQUE,
//         password VARCHAR(255),
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         reset_token VARCHAR(255),
//         reset_expires BIGINT,
//         google_id VARCHAR(255)
//       );
//     `);

//     // Questions table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS questions (
//         questionid SERIAL PRIMARY KEY,
//         userid INTEGER NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
//         title VARCHAR(255) NOT NULL,
//         description TEXT NOT NULL,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         views INTEGER DEFAULT 0,
//         answer_count INTEGER DEFAULT 0,
//         question_uuid VARCHAR(36) NOT NULL UNIQUE
//       );
//     `);

//     // Answers table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS answers (
//         answerid SERIAL PRIMARY KEY,
//         userid INTEGER NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
//         questionid INTEGER NOT NULL REFERENCES questions(questionid) ON DELETE CASCADE,
//         answer TEXT NOT NULL,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         comment_count INTEGER DEFAULT 0
//       );
//     `);

//     // Answer Likes table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS answer_likes (
//         likeid SERIAL PRIMARY KEY,
//         answerid INTEGER NOT NULL REFERENCES answers(answerid) ON DELETE CASCADE,
//         userid INTEGER NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(answerid, userid)
//       );
//     `);

//     // Comments table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS comments (
//         commentid SERIAL PRIMARY KEY,
//         answerid INTEGER NOT NULL REFERENCES answers(answerid) ON DELETE CASCADE,
//         userid INTEGER NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
//         comment TEXT NOT NULL,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     // Indexes
//     await pool.query(`
//       CREATE INDEX IF NOT EXISTS idx_questions_userid ON questions(userid);
//       CREATE INDEX IF NOT EXISTS idx_questions_createdat ON questions(createdAt);
//       CREATE INDEX IF NOT EXISTS idx_answers_questionid ON answers(questionid);
//       CREATE INDEX IF NOT EXISTS idx_answers_userid ON answers(userid);
//       CREATE INDEX IF NOT EXISTS idx_answer_likes_answerid ON answer_likes(answerid);
//       CREATE INDEX IF NOT EXISTS idx_answer_likes_userid ON answer_likes(userid);
//       CREATE INDEX IF NOT EXISTS idx_comments_answerid ON comments(answerid);
//       CREATE INDEX IF NOT EXISTS idx_comments_userid ON comments(userid);
//     `);

//     console.log("✅ All tables created successfully!");
//   } catch (error) {
//     console.error("❌ Error creating tables:", error);
//   }
// };

// createTables();

// ----------------- Attach pool to app -----------------
app.set("dbPool", pool);

// ----------------- Test Routes -----------------
app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is running with Aiven PostgreSQL!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const pool = req.app.get("dbPool");
    const result = await pool.query("SELECT NOW() as current_time");
    res.json({
      message: "Database connection successful!",
      currentTime: result.rows[0].current_time,
    });
  } catch (error) {
    res.status(500).json({
      error: "Database connection failed",
      message: error.message,
    });
  }
});

// ----------------- Import Routes -----------------
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoute");
const answerRoutes = require("./routes/answerRoute");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");
const aiRoutes = require("./routes/ai");

// Mount routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1", questionRoutes);
app.use("/api/v1", answerRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/ai", aiRoutes);

// Default route
app.get("/", (req, res) =>
  res
    .status(200)
    .send("Welcome to Evangadi AI Forum Backend with Aiven PostgreSQL!")
);

// ----------------- Socket.IO -----------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

let onlineUsers = new Set();
io.on("connection", (socket) => {
  console.log("🔗 User connected:", socket.id);
  onlineUsers.add(socket.id);
  io.emit("onlineUsers", onlineUsers.size);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    onlineUsers.delete(socket.id);
    io.emit("onlineUsers", onlineUsers.size);
  });
});

// ----------------- Graceful Shutdown -----------------
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await pool.end();
  process.exit(0);
});

// ----------------- Start Server -----------------
server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log("✅ CORS enabled for:", allowedOrigins);
});
