const { StatusCodes } = require("http-status-codes");
const pool = require("../config/dbConfig"); // MySQL connection

// ======================== TOGGLE LIKE ========================
exports.toggleLike = async (req, res) => {
  const { answerid, userid } = req.body;

  if (!answerid || !userid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Missing data" });
  }

  try {
    // Check if already liked
    const [existing] = await pool.execute(
      "SELECT * FROM answer_likes WHERE answerid=? AND userid=?",
      [answerid, userid]
    );

    if (existing.length > 0) {
      // Unlike
      await pool.execute(
        "DELETE FROM answer_likes WHERE answerid=? AND userid=?",
        [answerid, userid]
      );
      return res.status(StatusCodes.OK).json({ liked: false });
    } else {
      // Like
      await pool.execute(
        "INSERT INTO answer_likes(answerid, userid) VALUES(?,?)",
        [answerid, userid]
      );
      return res.status(StatusCodes.OK).json({ liked: true });
    }
  } catch (err) {
    console.error("❌ Error toggling like:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

// ======================== GET TOTAL LIKES ========================
exports.getLikesCount = async (req, res) => {
  const { answerid } = req.params;

  try {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) AS like_count FROM answer_likes WHERE answerid=?",
      [answerid]
    );

    const likeCount = parseInt(rows[0].like_count, 10) || 0;

    return res.status(StatusCodes.OK).json({ likeCount });
  } catch (err) {
    console.error("❌ Error fetching likes:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};
