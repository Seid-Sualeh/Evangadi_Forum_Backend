require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
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

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173"], // your React frontend URL
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
app.use("/api/v1/ai", aiRoutes); // ✅ AI route now lives under /api/v1/ai
app.use("/api/v1", answerRoutes);
// Start server
async function start() {
  try {
    await dbConnection.execute("SELECT 'test'");
    console.log("✅ Database connected successfully");
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
}

start();
