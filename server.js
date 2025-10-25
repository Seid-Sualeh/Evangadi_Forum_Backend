// // server.js
// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io");













// // Initialize Express app
// const app = express();
// const port = process.env.PORT || 5000;

// // ----------------- Middleware -----------------
// app.use(
//   cors({
//     origin: ["http://localhost:5173"], // frontend origin
//     credentials: true,
//   })
// );
// app.use(express.json());

// // ----------------- Supabase Client -----------------
// const { createClient } = require("@supabase/supabase-js");

// const supabase = createClient(
//   process.env.SUPABASE_URL || "https://iqjwyerxcxibvlgrrnca.supabase.co",
//   process.env.SUPABASE_ANON_KEY ||
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxand5ZXJ4Y3hpYnZsZ3JybmNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMTk1MTAsImV4cCI6MjA3Njg5NTUxMH0.wIci350uOsJx6WnNLefGcYi8qm1VjpJfTsHBOHSbcsg"
// );




// // CORS configuration - ADD YOUR NETLIFY DOMAIN
// const allowedOrigins = [
//   'https://seidforum.netlify.app', // Your Netlify domain
//   'http://localhost:3000',         // Local development
//   'http://localhost:3001'          // Alternative local port
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// }));

// // Handle preflight requests
// app.options('*', cors());

// // Your routes here...
// app.get('/api/health', (req, res) => {
//   res.json({ message: 'CORS is configured properly!' });
// });

// // ... rest of your routes



// // Test Supabase connection
// async function testSupabase() {
//   const { data, error } = await supabase.from("questions").select("*").limit(1);
//   if (error) {
//     console.error("❌ Supabase connection error:", error);
//   } else {
//     console.log("✅ Supabase connected successfully!");
//   }
// }
// testSupabase();

// // ----------------- Routes -----------------
// // Import routes
// const userRoutes = require("./routes/userRoutes");
// const questionRoutes = require("./routes/questionRoute");
// const answerRoutes = require("./routes/answerRoute");
// const aiRoutes = require("./routes/ai");
// const commentRoutes = require("./routes/commentRoutes");
// const likeRoutes = require("./routes/likeRoutes");

// // Mount routes
// app.use("/api/v1/user", userRoutes);
// app.use("/api/v1", questionRoutes);
// app.use("/api/v1", answerRoutes);
// app.use("/api/v1/ai", aiRoutes);
// app.use("/api/v1", commentRoutes);
// app.use("/api/v1", likeRoutes);

// // Default route
// app.get("/", (req, res) => {
//   res.status(200).send("Welcome to Evangadi AI Forum Backend!");
// });

// // ----------------- HTTP + Socket.IO -----------------
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173"],
//     credentials: true,
//   },
// });

// // Track online users
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
// server.listen(port, () => {
//   console.log(`🚀 Server running on port ${port}`);
// });







// server.js - REPLACE THE ENTIRE CORS SECTION

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// Initialize Express app
const app = express();
const port = process.env.PORT || 5001; // Changed from 5000

// ✅ CORRECT CORS CONFIGURATION (ONLY ONCE)
const allowedOrigins = [
  'https://evangadi-forum-front-end-coral.vercel.app', // Your Vercel frontend
  'https://seidforum.netlify.app', // Your Netlify domain
  'http://localhost:3000',         
  'http://localhost:3001',
  'http://localhost:5173' // Vite default port
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('🚫 Blocked by CORS:', origin);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    console.log('✅ Allowed by CORS:', origin);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'CORS is configured properly!',
    allowedOrigins: allowedOrigins,
    timestamp: new Date().toISOString()
  });
});

// ----------------- Supabase Client -----------------
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY // Use SUPABASE_KEY instead of SUPABASE_ANON_KEY
);

// Remove the duplicate dbConfig.js connection since we're using Supabase client
// Test Supabase connection
async function testSupabase() {
  const { data, error } = await supabase.from("questions").select("*").limit(1);
  if (error) {
    console.error("❌ Supabase connection error:", error);
  } else {
    console.log("✅ Supabase connected successfully!");
  }
}
testSupabase();

// ----------------- Routes -----------------
// Import routes
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoute");
const answerRoutes = require("./routes/answerRoute");
const aiRoutes = require("./routes/ai");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");

// Mount routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1", questionRoutes);
app.use("/api/v1", answerRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1", commentRoutes);
app.use("/api/v1", likeRoutes);

// Default route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Evangadi AI Forum Backend!");
});

// ----------------- HTTP + Socket.IO -----------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Use the same allowed origins
    credentials: true,
  },
});

// Track online users
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

// ----------------- Start Server -----------------
server.listen(port, '0.0.0.0', () => { // Add '0.0.0.0' for production
  console.log(`🚀 Server running on port ${port}`);
  console.log('✅ CORS enabled for:', allowedOrigins);
});