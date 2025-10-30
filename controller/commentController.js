const { StatusCodes } = require("http-status-codes");
const pool = require("../config/dbConfig"); // MySQL connection

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
    await pool.execute(
      "INSERT INTO comments(answerid, userid, comment) VALUES(?,?,?)",
      [answerid, userid, comment]
    );

    // 2️⃣ Increase the comment_count in the related answer
    await pool.execute(
      "UPDATE answers SET comment_count = COALESCE(comment_count,0)+1 WHERE answerid=?",
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
    const [rows] = await pool.execute(
      `SELECT c.commentid, c.comment, c.createdAt, u.username
       FROM comments c
       INNER JOIN users u ON c.userid = u.userid
       WHERE c.answerid = ?
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
