const { StatusCodes } = require("http-status-codes");
const pool = require("../config/dbConfig"); // Neon DB connection

// ======================== ADD COMMENT ========================
exports.addComment = async (req, res) => {
  const { answerid, userid, comment } = req.body;

  if (!answerid || !userid || !comment) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  try {
    // 1️⃣ Insert the comment
    await pool.query(
      "INSERT INTO comments(answerid, userid, comment) VALUES($1,$2,$3)",
      [answerid, userid, comment]
    );

    // 2️⃣ Increase the comment_count in the related answer
    await pool.query(
      "UPDATE answers SET comment_count = COALESCE(comment_count,0)+1 WHERE answerid=$1",
      [answerid]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "✅ Comment added successfully" });
  } catch (err) {
    console.error("❌ Error adding comment:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

// ======================== GET COMMENTS BY ANSWER ========================
exports.getCommentsByAnswer = async (req, res) => {
  const { answerid } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT c.commentid, c.comment, c.createdAt, u.username
       FROM comments c
       INNER JOIN users u ON c.userid = u.userid
       WHERE c.answerid = $1
       ORDER BY c.createdAt DESC`,
      [answerid]
    );

    return res.status(StatusCodes.OK).json(rows);
  } catch (err) {
    console.error("❌ Error fetching comments:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};
