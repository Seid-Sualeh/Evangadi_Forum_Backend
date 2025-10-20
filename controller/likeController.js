const db = require("../config/dbConfig");
const { StatusCodes } = require("http-status-codes");

// ✅ Like or Unlike answer
exports.toggleLike = async (req, res) => {
  const { answerid, userid } = req.body;

  if (!answerid || !userid)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Missing data" });

  try {
    const [existing] = await db.query(
      "SELECT * FROM answer_likes WHERE answerid = ? AND userid = ?",
      [answerid, userid]
    );

    if (existing.length > 0) {
      await db.query(
        "DELETE FROM answer_likes WHERE answerid = ? AND userid = ?",
        [answerid, userid]
      );
      res.status(StatusCodes.OK).json({ liked: false });
    } else {
      await db.query(
        "INSERT INTO answer_likes (answerid, userid) VALUES (?, ?)",
        [answerid, userid]
      );
      res.status(StatusCodes.OK).json({ liked: true });
    }
  } catch (err) {
    console.error("❌ Error toggling like:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

// ✅ Get total likes for an answer
exports.getLikesCount = async (req, res) => {
  const { answerid } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS likeCount FROM answer_likes WHERE answerid = ?",
      [answerid]
    );
    res.status(StatusCodes.OK).json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching likes:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};
