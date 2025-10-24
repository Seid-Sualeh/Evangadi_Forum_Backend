const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL, // Make sure this exists in .env
  process.env.SUPABASE_KEY
);

// Helper: Generate JWT
function generateToken(user) {
  return jwt.sign(
    { userid: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ✅ Register
async function register(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });

  try {
    // Check if user exists
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{ username, email, password: hashedPassword }])
      .select()
      .single();

    if (insertError) throw insertError;

    const token = generateToken(newUser);

    res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
      token,
      user: { id: newUser.id, username, email },
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error",
      error: err.message,
    });
  }
}

// ✅ Login
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.status(StatusCodes.OK).json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error",
      error: err.message,
    });
  }
}

// ✅ Check authentication
async function check(req, res) {
  try {
    res.status(StatusCodes.OK).json({
      message: "Authenticated",
      user: req.user, // comes from authMiddleware
    });
  } catch (err) {
    console.error("❌ Check error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error",
      error: err.message,
    });
  }
}

// ✅ Forgot password
async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Email is required" });

  try {
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

    await supabase
      .from("password_resets")
      .insert([{ userid: user.id, token, expires }]);

    // TODO: Send email with reset link containing token

    res.status(StatusCodes.OK).json({
      message: "Password reset token created. Check your email.",
      token, // for testing only; remove in production
    });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error",
      error: err.message,
    });
  }
}

// ✅ Reset password
async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Token and password are required" });

  try {
    const { data: reset } = await supabase
      .from("password_resets")
      .select("*")
      .eq("token", token)
      .single();

    if (!reset || new Date(reset.expires) < new Date())
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Token invalid or expired" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", reset.userid);

    await supabase.from("password_resets").delete().eq("token", token);

    res.status(StatusCodes.OK).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error",
      error: err.message,
    });
  }
}

// ✅ Google login (simplified)
async function googleLogin(req, res) {
  const { email, username } = req.body;

  if (!email || !username)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Email and username required" });

  try {
    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      const { data: newUser } = await supabase
        .from("users")
        .insert([{ email, username }])
        .select()
        .single();
      user = newUser;
    }

    const token = generateToken(user);

    res.status(StatusCodes.OK).json({
      message: "Google login successful",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("❌ Google login error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error",
      error: err.message,
    });
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
