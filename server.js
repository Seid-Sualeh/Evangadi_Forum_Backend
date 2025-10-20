require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
// Corrected import using destructuring
const { Server } = require("socket.io");
const port = process.env.PORT || 5000;

// Middleware
const authMiddleware = require("./middleware/authMiddleware");

// Database connection
const dbConnection = require("./config/dbConfig");

// Routes
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoute");
const answerRoutes = require("./routes/answerRoute");
const aiRoutes = require("./routes/ai");

const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

// Default route
app.get("/", authMiddleware, (req, res) => {
  res
    .status(200)
    .send("Welcome to Evangadi AI Forum Backend! You are authenticated.");
});

// Routes middleware
app.use("/api/v1/user", userRoutes);
app.use("/api/v1", questionRoutes);
app.use("/api/v1", answerRoutes);
app.use("/api/v1/ai", aiRoutes);

app.use("/api/v1", commentRoutes);
app.use("/api/v1", likeRoutes);

// Create HTTP server and attach Express app
const server = http.createServer(app);

// Create Socket.IO server and attach it to the HTTP server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

// ✅ Track connected users
let onlineUsers = new Set();

io.on("connection", (socket) => {
  // console.log("🔗 User connected:", socket.id);
  onlineUsers.add(socket.id);

  io.emit("onlineUsers", onlineUsers.size);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    onlineUsers.delete(socket.id);

    io.emit("onlineUsers", onlineUsers.size);
  });
});

// Start server
async function start() {
  try {
    await dbConnection.execute("SELECT 'test'");
    console.log("✅ Database connected successfully");

    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
}

start();
