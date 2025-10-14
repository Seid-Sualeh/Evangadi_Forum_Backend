
const dbConnection = require("../config/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

dotenv.config();

// ======================== REGISTER ========================
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  const currentTimestamp = new Date();
  currentTimestamp.setHours(currentTimestamp.getHours() + 3);
  const formattedTimestamp = currentTimestamp
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ Msg: "Please provide all required fields." });
  }

  if (password.length < 8) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ Msg: "Password should be at least 8 characters long." });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT username, userid FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (user.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        Msg: "Username or Email already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword, formattedTimestamp]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ Msg: "User created successfully." });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ Msg: "Internal server error." });
  }
}

// ======================== LOGIN ========================
async function login(req, res) {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ Msg: "Please provide username/email and password." });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT username, userid, password FROM users WHERE email = ? OR username = ?",
      [usernameOrEmail, usernameOrEmail]
    );

    if (user.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credentials." });
    }

    const username = user[0].username;
    const userid = user[0].userid;
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res
      .status(StatusCodes.OK)
      .json({ msg: "User logged in successfully", token });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ Msg: "Internal server error." });
  }
}

// ======================== CHECK ========================
function check(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;
  return res.status(StatusCodes.OK).json({ username, userid });
}

// ======================== FORGOT PASSWORD ========================

async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) return res.status(400).json({ msg: "Email is required" });

  try {
    // Check if user exists
    const [user] = await dbConnection.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!user.length)
      return res.status(404).json({ msg: "No account found with this email" });

    // Generate a unique token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 3600000; // 1 hour

    // Store token and expiry in DB
    await dbConnection.query(
      "UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?",
      [token, expires, email]
    );

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    // Reset link
    const resetURL = `http://localhost:5173/reset-password/${token}`;

    // Send email
    await transporter.sendMail({
      from: `"Evangadi Forum" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h3>Assalamu Alaikum!</h3>
        <p>You requested a password reset. Click the button below:</p>
        <a href="${resetURL}" style="background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    res.status(200).json({ msg: "Password reset email sent successfully ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error. Please try again." });
  }
}

// ======================
// Reset Password
// ======================
async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) return res.status(400).json({ msg: "Password is required" });

  try {
    const [user] = await dbConnection.query("SELECT * FROM users WHERE reset_token = ?", [
      token,
    ]);
    if (!user.length)
      return res.status(400).json({ msg: "Invalid or expired token" });

    const validUser = user[0];

    if (Date.now() > validUser.reset_expires)
      return res.status(400).json({ msg: "Token expired" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update DB
    await dbConnection.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?",
      [hashedPassword, validUser.id]
    );

    res.status(200).json({ msg: "Password reset successful ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error. Please try again." });
  }
}


// ======================== GOOGLE LOGIN ========================



const googleLogin = async (req, res) => {
  const { email, username, googleId } = req.body;

  try {
    // Check if user already exists
    const [user] = await dbConnection.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (user.length > 0) {
      // Generate JWT token
      const token = jwt.sign(
        { userid: user[0].userid },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      return res.status(200).json({ message: "Login successful", token });
    }

    // Insert new Google user (firstname, lastname, password → NULL)
    await dbConnection.query(
      `INSERT INTO users (username, email, google_id, firstname, lastname, password)
       VALUES (?, ?, ?, NULL, NULL, NULL)`,
      [username, email, googleId]
    );

    const [newUser] = await dbConnection.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    const token = jwt.sign(
      { userid: newUser[0].userid },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(201).json({ message: "User created and logged in", token });
  } catch (err) {
    console.error("❌ Google Login Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};









module.exports = {
  register,
  login,
  check,
  forgotPassword,
  googleLogin,
  resetPassword,
};

