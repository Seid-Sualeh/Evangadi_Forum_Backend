
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;






// 2. Define the allowed origins from environment variables
// Use the exact URL of your Netlify site.
const allowedOrigins = [
    // Your Netlify Frontend URL (The one getting blocked)
    'https://seidforum.netlify.app',
    // Optional: Add localhost for local development testing
    'http://localhost:3000', 
  'http://localhost:5173',
  'http://localhost:5000',
    // Add any other domains you might use
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        // OR allow the origin if it is in our allowedOrigins list
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Block the request if the origin is not allowed
            callback(new Error('Not allowed by CORS'));
        }
    },
    // Specify the allowed HTTP methods
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies/authorization headers to be sent
    optionsSuccessStatus: 204 // For preflight requests
};

// 3. Apply the CORS middleware
app.use(cors(corsOptions));




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
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Evangadi AI Forum Backend!");
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



// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const app = express();
// const port = process.env.PORT || 5000;
// const { getQuestionByUuid } = require("../controller/questionController.js");
// // Database connection
// const dbConnection = require("./config/dbConfig");

// // Routes
// const userRoutes = require("./routes/userRoutes");
// const questionRoutes = require("./routes/questionRoute");
// const answerRoutes = require("./routes/answerRoute");
// const aiRoutes = require("./routes/ai");


// const questionRoutes = require("./routes/questionRoutes");
// app.use("/api/v1/question", questionRoutes);


// // Middleware
// app.use(
//   cors({
//     origin: ["http://localhost:5173"], // ✅ React frontend URL
//     credentials: true,
//   })
// );
// app.use(express.json());

// // Default Route
// app.get("/", (req, res) => {
//   res.status(200).send("✅ Welcome to Evangadi AI Forum Backend!");
// });

// // Route Middleware
// app.use("/api/v1/user", userRoutes);
// app.use("/api/v1", questionRoutes);
// app.use("/api/v1", answerRoutes);
// app.use("/api/v1/ai", aiRoutes);
// app.get("/api/v1/question/:uuid", getQuestionByUuid);
// // Start Server
// async function start() {
//   try {
//     await dbConnection.execute("SELECT 'test'");
//     console.log("✅ Database connected successfully");
//     app.listen(port, () => {
//       console.log(`🚀 Server running on port ${port}`);
//     });
//   } catch (err) {
//     console.error("❌ Database connection failed:", err.message);
//   }
// }

// start();



// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const app = express();
// const port = process.env.PORT || 5000;

// // Database connection
// const dbConnection = require("./config/dbConfig");

// // Controllers
// const { getQuestionByUuid } = require("./controller/questionController");

// // Routes
// const questionRoutes = require("./routes/questionRoute");
// const userRoutes = require("./routes/userRoutes");

// const answerRoutes = require("./routes/answerRoute");
// const aiRoutes = require("./routes/ai");









// // ✅ Middleware
// app.use(
//   cors({
//     origin: ["http://localhost:5173"], // React frontend
//     credentials: true,
//   })
// );
// app.use(express.json());

// // ✅ Default route
// app.get("/", (req, res) => {
//   res.status(200).send("✅ Welcome to Evangadi AI Forum Backend!");
// });

// // ✅ Routes middleware
// app.use("/api/v1/user", userRoutes);
// app.use("/api/v1", questionRoutes);
// app.use("/api/v1", answerRoutes);
// app.use("/api/v1/ai", aiRoutes);

// // ✅ Add UUID-based question route
// app.get("/api/v1/question/:uuid", getQuestionByUuid);

// // ✅ Start server
// async function start() {
//   try {
//     await dbConnection.execute("SELECT 'test'");
//     console.log("✅ Database connected successfully");
//     app.listen(port, () => {
//       console.log(`🚀 Server running on port ${port}`);
//     });
//   } catch (err) {
//     console.error("❌ Database connection failed:", err.message);
//   }
// }

// start();

