// middleware/authMiddleware.js
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Log the header for debugging
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("❌ Missing or malformed Authorization header");
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("❌ JWT_SECRET not set in environment!");
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server misconfigured" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, secret);

    // Log decoded token
    console.log("Decoded JWT:", decoded);

    // Attach user info to request
    req.user = {
      username: decoded.username,
      userid: decoded.userid,
    };

    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
  }
}

module.exports = authMiddleware;
