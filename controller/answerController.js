const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../config/dbConfig");

// ✅ Get all answers for a question (with comment count)
async function getAnswer(req, res) {
  const questionid = req.params.question_id;

  try {
    const [rows] = await dbConnection.query(
      `SELECT 
          a.answerid, 
          a.userid AS answer_userid, 
          a.answer,
          a.createdAt,
          u.username,
          -- ✅ Count total comments per answer
          (SELECT COUNT(*) FROM comments c WHERE c.answerid = a.answerid) AS comment_count
        FROM answers a 
        INNER JOIN users u ON a.userid = u.userid
        WHERE a.questionid = ?
        ORDER BY a.createdAt DESC`,
      [questionid]
    );

    return res.status(StatusCodes.OK).json({ rows });
  } catch (err) {
    console.error("❌ Error fetching answers:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong, please try again later",
    });
  }
}

// ✅ Post a new answer - FIXED VERSION
async function postAnswer(req, res) {
  const { userid, answer, questionid } = req.body;

  if (!userid || !answer || !questionid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  try {
    let numericQuestionId;

    // ✅ Check if questionid is a UUID (string with hyphens)
    if (typeof questionid === "string" && questionid.includes("-")) {
      // Convert UUID to numeric question ID
      const [question] = await dbConnection.query(
        "SELECT questionid FROM questions WHERE question_uuid = ?",
        [questionid]
      );

      if (question.length === 0) {
        console.log("❌ Question not found for UUID:", questionid);
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Question not found",
        });
      }

      numericQuestionId = question[0].questionid;
    } else {
      // It's already a numeric ID
      numericQuestionId = questionid;
    }

    // ✅ Insert the answer using the CORRECT numeric question ID
    await dbConnection.query(
      "INSERT INTO answers (userid, questionid, answer) VALUES (?, ?, ?)",
      [userid, numericQuestionId, answer]
    );

    // ✅ Increase the question's answer_count using the CORRECT ID
    await dbConnection.query(
      "UPDATE questions SET answer_count = answer_count + 1 WHERE questionid = ?",
      [numericQuestionId]
    );

    // console.log("✅ Answer posted successfully");
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "✅ Answer posted successfully" });
  } catch (err) {
    console.error("❌ Error posting answer:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong, please try again later: " + err.message,
    });
  }
}

// ✅ UPDATE/EDIT ANSWER
async function updateAnswer(req, res) {
  const { answerid } = req.params;
  const { answer } = req.body;
  const userid = req.user.userid; // From auth middleware

  if (!answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Answer text is required",
    });
  }

  try {
    // Check if answer exists and user owns it
    const [answerRecord] = await dbConnection.query(
      "SELECT userid, questionid FROM answers WHERE answerid = ?",
      [answerid]
    );

    if (answerRecord.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Answer not found",
      });
    }

    if (answerRecord[0].userid !== userid) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You can only edit your own answers",
      });
    }

    // Update the answer
    await dbConnection.query(
      "UPDATE answers SET answer = ? WHERE answerid = ?",
      [answer, answerid]
    );

    return res.status(StatusCodes.OK).json({
      message: "✅ Answer updated successfully",
    });
  } catch (error) {
    console.error("❌ Error updating answer:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong, please try again later",
    });
  }
}

module.exports = {
  getAnswer,
  postAnswer,
  updateAnswer,
};
