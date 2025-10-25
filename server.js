// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");













// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// ----------------- Middleware -----------------
app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend origin
    credentials: true,
  })
);
app.use(express.json());

// ----------------- Supabase Client -----------------
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL || "https://iqjwyerxcxibvlgrrnca.supabase.co",
  process.env.SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxand5ZXJ4Y3hpYnZsZ3JybmNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMTk1MTAsImV4cCI6MjA3Njg5NTUxMH0.wIci350uOsJx6WnNLefGcYi8qm1VjpJfTsHBOHSbcsg"
);



// ----------------- CORS Configuration -----------------
// allow the Netlify frontend and localhost during testing
const ALLOWED_ORIGINS = [
  "https://seidforum.netlify.app",   // production frontend
  "http://localhost:5173",
  "http://localhost:5000/api/v1"      // local dev (Vite)
];

app.use(express.json());

// CORS configuration
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,                // allow cookies/auth if needed
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","Accept","X-Requested-With"]
}));

// Make sure preflight requests are handled
app.options("*", (req, res) => {
  res.sendStatus(204);
});

// Handle preflight requests
app.options('*', cors());

// Your routes here...
app.get('/api/health', (req, res) => {
  res.json({ message: 'CORS is configured properly!' });
});

// ... rest of your routes



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
    origin: ["http://localhost:5173"],
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
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
