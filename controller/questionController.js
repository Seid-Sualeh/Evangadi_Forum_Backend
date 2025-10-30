const { StatusCodes } = require("http-status-codes");
const pool = require("../config/dbConfig"); // MySQL connection
const { v4: uuidv4 } = require("uuid");

// ======================== POST A QUESTION ========================
async function postQuestion(req, res) {
  let { userid, title, description } = req.body;

  // Validate input
  if (!userid || !title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "All fields are required (userid, title, description)",
    });
  }

  // Ensure userid is an integer
  userid = parseInt(userid, 10);
  if (isNaN(userid)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid userid format (must be an integer)" });
  }

  try {
    const questionUuid = uuidv4();

    await pool.execute(
      `INSERT INTO questions (userid, title, description, question_uuid, views, answer_count)
       VALUES (?, ?, ?, ?, 0, 0)`,
      [userid, title, description, questionUuid]
    );

    return res.status(StatusCodes.CREATED).json({
      message: "✅ Question posted successfully!",
      questionUuid,
    });
  } catch (err) {
    console.error("❌ Error posting question:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while posting question: " + err.message,
    });
  }
}

// ======================== GET ALL QUESTIONS ========================
async function getAllQuestions(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT q.questionid, q.question_uuid, q.title, q.description, q.createdAt, q.views, q.answer_count,
              u.userid, u.username
       FROM questions q
       JOIN users u ON q.userid = u.userid
       ORDER BY q.createdAt DESC`
    );

    return res.status(StatusCodes.OK).json({
      message: "✅ Questions fetched successfully!",
      questions: rows,
    });
  } catch (err) {
    console.error("❌ Error fetching questions:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error: " + err.message });
  }
}

// ======================== GET SINGLE QUESTION AND ANSWERS ========================
async function getQuestionAndAnswer(req, res) {
  const { questionUuid } = req.params;

  try {
    // Get the question
    const [questionRows] = await pool.execute(
      `SELECT q.questionid, q.question_uuid, q.title, q.description, q.views, q.answer_count, q.userid, q.createdAt, u.username
       FROM questions q
       JOIN users u ON q.userid = u.userid
       WHERE q.question_uuid = ?`,
      [questionUuid]
    );

    const question = questionRows[0];
    if (!question) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "❌ Question not found" });
    }

    // Increment views
    await pool.execute(
      `UPDATE questions SET views = views + 1 WHERE question_uuid = ?`,
      [questionUuid]
    );
    const updatedViews = question.views + 1;

    // Get related answers
    const [answerRows] = await pool.execute(
      `SELECT a.answerid, a.userid, a.answer, a.createdAt, a.comment_count, u.username
       FROM answers a
       JOIN users u ON a.userid = u.userid
       WHERE a.questionid = ?
       ORDER BY a.createdAt ASC`,
      [question.questionid]
    );

    const questionDetails = {
      question_uuid: question.question_uuid,
      questionid: question.questionid,
      title: question.title,
      description: question.description,
      views: updatedViews,
      answer_count: question.answer_count,
      createdAt: question.createdAt,
      username: question.username,
      userid: question.userid,
      answers: answerRows,
    };

    return res.status(StatusCodes.OK).json(questionDetails);
  } catch (error) {
    console.error("❌ Error fetching question:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching question details: " + error.message,
    });
  }
}

// ======================== UPDATE QUESTION ========================
async function updateQuestion(req, res) {
  const { questionUuid } = req.params;
  const { title, description } = req.body;

  // Get userid from auth (ensure it's integer)
  const userid = parseInt(req.user?.userid, 10);

  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Title and description are required" });
  }

  if (isNaN(userid)) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized: invalid user" });
  }

  try {
    // Check if question exists
    const [rows] = await pool.execute(
      "SELECT userid FROM questions WHERE question_uuid = ?",
      [questionUuid]
    );

    const question = rows[0];
    if (!question) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found" });
    }

    // Ensure user owns the question
    if (question.userid !== userid) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "You can only edit your own questions" });
    }

    // Perform update
    await pool.execute(
      "UPDATE questions SET title=?, description=? WHERE question_uuid=?",
      [title, description, questionUuid]
    );

    return res
      .status(StatusCodes.OK)
      .json({ message: "✅ Question updated successfully" });
  } catch (error) {
    console.error("❌ Error updating question:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while updating: " + error.message,
    });
  }
}

module.exports = {
  postQuestion,
  getAllQuestions,
  getQuestionAndAnswer,
  updateQuestion,
};
