const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require("../config/dbConfig"); // MySQL connection
const { v4: uuidv4 } = require("uuid");

// Helper: Generate JWT
function generateToken(user) {
  return jwt.sign(
    { userid: user.userid, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ======================== REGISTER ========================
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  if (!username || !firstname || !lastname || !email || !password)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });

  try {
    // Check if user exists
    const [existing] = await pool.execute("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    if (existing.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.execute(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    const userid = result.insertId;

    const token = generateToken({ userid, email });
    res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
      token,
      user: {
        userid,
        username,
        email,
      },
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error: err.message });
  }
}

// ======================== LOGIN ========================
async function login(req, res) {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });

  try {
    // Check by email or username
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email=? OR username=?",
      [usernameOrEmail, usernameOrEmail]
    );

    const user = rows[0];
    if (!user)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.status(StatusCodes.OK).json({
      message: "Login successful",
      token,
      user: {
        userid: user.userid,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error: err.message });
  }
}

// ======================== CHECK AUTH ========================
async function check(req, res) {
  try {
    res
      .status(StatusCodes.OK)
      .json({ message: "Authenticated", user: req.user });
  } catch (err) {
    console.error("❌ Check error:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error: err.message });
  }
}

// ======================== FORGOT PASSWORD ========================
async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Email is required" });

  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    const user = rows[0];
    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 3600 * 1000; // 1 hour

    await pool.execute(
      "UPDATE users SET reset_token=?, reset_expires=? WHERE userid=?",
      [token, expires, user.userid]
    );

    // TODO: send email with token link
    res
      .status(StatusCodes.OK)
      .json({ message: "Password reset token created", token }); // token for testing only
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error: err.message });
  }
}

// ======================== RESET PASSWORD ========================
async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;
  if (!token || !password)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Token and password required" });

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE reset_token=?",
      [token]
    );
    const user = rows[0];
    if (!user || user.reset_expires < Date.now())
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Token invalid or expired" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute(
      "UPDATE users SET password=?, reset_token=NULL, reset_expires=NULL WHERE userid=?",
      [hashedPassword, user.userid]
    );

    res.status(StatusCodes.OK).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error: err.message });
  }
}

// ======================== GOOGLE LOGIN ========================
async function googleLogin(req, res) {
  const { email, username, googleId } = req.body;
  if (!email || !username || !googleId)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Email, username, and googleId required" });

  try {
    let [rows] = await pool.execute("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    let user = rows[0];

    if (!user) {
      const [result] = await pool.execute(
        "INSERT INTO users (email, username, google_id) VALUES (?, ?, ?)",
        [email, username, googleId]
      );
      user = {
        userid: result.insertId,
        email,
        username,
      };
    } else if (!user.google_id) {
      // Update existing user with google_id
      await pool.execute("UPDATE users SET google_id=? WHERE userid=?", [
        googleId,
        user.userid,
      ]);
      user.google_id = googleId;
    }

    const token = generateToken(user);
    res
      .status(StatusCodes.OK)
      .json({ message: "Google login successful", token, user });
  } catch (err) {
    console.error("❌ Google login error:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error: err.message });
  }
}

module.exports = {
  register,
  login,
  check,
  forgotPassword,
  resetPassword,
  googleLogin,
};
