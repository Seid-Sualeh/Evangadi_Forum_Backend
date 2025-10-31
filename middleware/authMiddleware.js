// // middleware/authMiddleware.js
// const { StatusCodes } = require("http-status-codes");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// async function authMiddleware(req, res, next) {
//   const authHeader = req.headers.authorization;

//   // Log the header for debugging
//   console.log("Authorization Header:", authHeader);

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     console.error("❌ Missing or malformed Authorization header");
//     return res
//       .status(StatusCodes.UNAUTHORIZED)
//       .json({ msg: "Authentication invalid" });
//   }

//   const secret = process.env.JWT_SECRET;
//   if (!secret) {
//     console.error("❌ JWT_SECRET not set in environment!");
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Server misconfigured" });
//   }

//   try {
//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, secret);

//     // Log decoded token
//     console.log("Decoded JWT:", decoded);

//     // Attach user info to request
//     req.user = {
//       username: decoded.username,
//       userid: decoded.userid,
//     };

//     next();
//   } catch (error) {
//     console.error("❌ Token verification failed:", error.message);
//     return res
//       .status(StatusCodes.UNAUTHORIZED)
//       .json({ msg: "Authentication invalid" });
//   }
// }

// module.exports = authMiddleware;




// // // middleware/authMiddleware.js
// // const { StatusCodes } = require("http-status-codes");
// // const jwt = require("jsonwebtoken");
// // require("dotenv").config();

// // async function authMiddleware(req, res, next) {
// //   const authHeader = req.headers.authorization;

// //   // Skip auth for health checks and monitoring endpoints
// //   if (req.path === "/health" || req.path === "/" || req.method === "OPTIONS") {
// //     console.log("✅ Skipping auth for health check/monitoring");
// //     return next();
// //   }

// //   // Enhanced logging
// //   console.log("Incoming Headers:", req.headers);
// //   console.log("Authorization Header:", authHeader);

// //   // Check if Authorization header exists and has correct format
// //   if (!authHeader) {
// //     console.error("❌ Authorization header is missing");
// //     return res.status(StatusCodes.UNAUTHORIZED).json({ 
// //       msg: "Authentication required. Please include Authorization header.",
// //       details: "Format: 'Bearer <token>'"
// //     });
// //   }

// //   if (!authHeader.startsWith("Bearer ")) {
// //     console.error("❌ Malformed Authorization header format");
// //     return res.status(StatusCodes.UNAUTHORIZED).json({ 
// //       msg: "Invalid Authorization header format",
// //       details: "Expected format: 'Bearer <token>'"
// //     });
// //   }

// //   const secret = process.env.JWT_SECRET;
// //   if (!secret) {
// //     console.error("❌ JWT_SECRET not set in environment!");
// //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
// //       msg: "Server configuration error" 
// //     });
// //   }

// //   try {
// //     const token = authHeader.split(" ")[1];
    
// //     // Check if token exists after Bearer
// //     if (!token) {
// //       console.error("❌ Token is missing after Bearer");
// //       return res.status(StatusCodes.UNAUTHORIZED).json({ 
// //         msg: "Token is required" 
// //       });
// //     }

// //     const decoded = jwt.verify(token, secret);
// //     console.log("✅ Decoded JWT:", decoded);

// //     // Attach user info to request
// //     req.user = {
// //       username: decoded.username,
// //       userid: decoded.userid,
// //     };

// //     next();
// //   } catch (error) {
// //     console.error("❌ Token verification failed:", error.message);
    
// //     if (error.name === 'JsonWebTokenError') {
// //       return res.status(StatusCodes.UNAUTHORIZED).json({ 
// //         msg: "Invalid token" 
// //       });
// //     }
    
// //     if (error.name === 'TokenExpiredError') {
// //       return res.status(StatusCodes.UNAUTHORIZED).json({ 
// //         msg: "Token has expired" 
// //       });
// //     }

// //     return res.status(StatusCodes.UNAUTHORIZED).json({ 
// //       msg: "Authentication invalid" 
// //     });
// //   }
// // }

// // module.exports = authMiddleware;









const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Authentication required",
      details: "Include header: Authorization: Bearer <token>",
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info
    req.user = {
      userid: decoded.userid,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
