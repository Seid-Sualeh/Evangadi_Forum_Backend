// ====================== server.js ======================
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { supabase } = require("./config/dbConfig");

// Initialize express app
const app = express();

// Middleware
app.use(express.json());

// ----------------- CORS Setup -----------------
const allowedOrigins = [
  "https://evangadi-forum-front-end-coral.vercel.app",
  "https://seidforum.netlify.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  })
);

app.options("*", cors());

// ----------------- Test Supabase Connection -----------------
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
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoute");
const answerRoutes = require("./routes/answerRoute");
const aiRoutes = require("./routes/ai");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");

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

// ----------------- Socket.IO -----------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
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

// ----------------- Start Server -----------------
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
