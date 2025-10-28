const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require("../config/dbConfig"); // Neon DB connection
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
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });

  try {
    // Check if user exists
    const { rows: existing } = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    if (existing.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userid = uuidv4();

    // Insert new user
    const { rows } = await pool.query(
      "INSERT INTO users(userid, username, email, password) VALUES($1,$2,$3,$4) RETURNING userid, username, email",
      [userid, username, email, hashedPassword]
    );

    const token = generateToken(rows[0]);
    res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
      token,
      user: rows[0],
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
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
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
    res
      .status(StatusCodes.OK)
      .json({
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
    const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    const user = rows[0];
    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

    await pool.query(
      "INSERT INTO password_resets(userid, token, expires) VALUES($1,$2,$3)",
      [user.userid, token, expires]
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
    const { rows } = await pool.query(
      "SELECT * FROM password_resets WHERE token=$1",
      [token]
    );
    const reset = rows[0];
    if (!reset || new Date(reset.expires) < new Date())
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Token invalid or expired" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("UPDATE users SET password=$1 WHERE userid=$2", [
      hashedPassword,
      reset.userid,
    ]);
    await pool.query("DELETE FROM password_resets WHERE token=$1", [token]);

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
  const { email, username } = req.body;
  if (!email || !username)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Email and username required" });

  try {
    let { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    let user = rows[0];

    if (!user) {
      const userid = uuidv4();
      const { rows: newRows } = await pool.query(
        "INSERT INTO users(userid,email,username) VALUES($1,$2,$3) RETURNING userid, email, username",
        [userid, email, username]
      );
      user = newRows[0];
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
