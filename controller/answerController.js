const { StatusCodes } = require("http-status-codes");
const pool = require("../config/dbConfig"); // Neon DB connection

// ======================== GET ALL ANSWERS ========================
exports.getAnswer = async (req, res) => {
  const questionUuid = req.params.question_id;

  try {
    // Convert UUID to numeric question ID
    const { rows: questionRows } = await pool.query(
      "SELECT questionid FROM questions WHERE question_uuid = $1",
      [questionUuid]
    );

    if (questionRows.length === 0)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found" });

    const questionid = questionRows[0].questionid;

    // Fetch answers with user info
    const { rows: answers } = await pool.query(
      `SELECT a.answerid, a.userid AS answer_userid, a.answer, a.createdAt,
              u.username,
              (SELECT COUNT(*) FROM comments c WHERE c.answerid = a.answerid) AS comment_count
       FROM answers a
       JOIN users u ON a.userid = u.userid
       WHERE a.questionid = $1
       ORDER BY a.createdAt DESC`,
      [questionid]
    );

    return res.status(StatusCodes.OK).json({ rows: answers });
  } catch (err) {
    console.error("❌ Error fetching answers:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong, please try again later",
    });
  }
};

// ======================== POST NEW ANSWER ========================
exports.postAnswer = async (req, res) => {
  const { userid, answer, questionid } = req.body;

  if (!userid || !answer || !questionid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  try {
    // Convert UUID to numeric question ID if needed
    let numericQuestionId = questionid;

    if (typeof questionid === "string" && questionid.includes("-")) {
      const { rows: questionRows } = await pool.query(
        "SELECT questionid FROM questions WHERE question_uuid = $1",
        [questionid]
      );

      if (questionRows.length === 0)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Question not found" });

      numericQuestionId = questionRows[0].questionid;
    }

    // Insert answer
    await pool.query(
      "INSERT INTO answers(userid, questionid, answer, createdAt) VALUES($1,$2,$3,NOW())",
      [userid, numericQuestionId, answer]
    );

    // Increment answer_count on question
    await pool.query(
      "UPDATE questions SET answer_count = COALESCE(answer_count,0)+1 WHERE questionid=$1",
      [numericQuestionId]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "✅ Answer posted successfully" });
  } catch (err) {
    console.error("❌ Error posting answer:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong, please try again later: " + err.message,
    });
  }
};

// ======================== UPDATE ANSWER ========================
exports.updateAnswer = async (req, res) => {
  const { answerid } = req.params;
  const { answer } = req.body;
  const userid = req.user.userid;

  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Answer text is required" });
  }

  try {
    const { rows: existingRows } = await pool.query(
      "SELECT userid FROM answers WHERE answerid=$1",
      [answerid]
    );

    if (existingRows.length === 0)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Answer not found" });

    const existingAnswer = existingRows[0];

    if (existingAnswer.userid !== userid)
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "You can only edit your own answers" });

    await pool.query(
      "UPDATE answers SET answer=$1, updatedAt=NOW() WHERE answerid=$2",
      [answer, answerid]
    );

    return res
      .status(StatusCodes.OK)
      .json({ message: "✅ Answer updated successfully" });
  } catch (err) {
    console.error("❌ Error updating answer:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong, please try again later",
    });
  }
};
