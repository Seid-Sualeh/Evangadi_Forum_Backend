const { StatusCodes } = require("http-status-codes");
const pool = require("../config/dbConfig"); // Neon DB connection
const { v4: uuidv4 } = require("uuid");

// ======================== POST A QUESTION ========================
async function postQuestion(req, res) {
  const { userid, title, description } = req.body;

  if (!userid || !title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  try {
    const questionUuid = uuidv4();
    const createdAt = new Date();

    await pool.query(
      `INSERT INTO questions(userid, title, description, question_uuid, created_at, views, answer_count)
       VALUES($1,$2,$3,$4,$5,0,0)`,
      [userid, title, description, questionUuid, createdAt]
    );

    return res.status(StatusCodes.CREATED).json({
      message: "✅ Question posted successfully",
      questionUuid,
    });
  } catch (err) {
    console.error("❌ Error posting question:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong: " + err.message,
    });
  }
}

// ======================== GET ALL QUESTIONS ========================
async function getAllQuestions(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT q.questionid, q.question_uuid, q.title, q.description, q.created_at, q.views, q.answer_count,
              u.userid, u.username
       FROM questions q
       JOIN users u ON q.userid = u.userid
       ORDER BY q.created_at DESC`
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
  const questionUuid = req.params.questionUuid;

  try {
    // Get question
    const { rows: questionRows } = await pool.query(
      `SELECT q.questionid, q.question_uuid, q.title, q.description, q.views, q.answer_count, q.userid, u.username
       FROM questions q
       JOIN users u ON q.userid = u.userid
       WHERE q.question_uuid = $1`,
      [questionUuid]
    );
    const question = questionRows[0];
    if (!question)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "❌ Question not found" });

    // Increment views
    await pool.query(
      "UPDATE questions SET views = views + 1 WHERE question_uuid = $1",
      [questionUuid]
    );

    // Get answers
    const { rows: answerRows } = await pool.query(
      `SELECT a.answerid, a.userid, a.answer, a.created_at, a.comment_count, u.username
       FROM answers a
       JOIN users u ON a.userid = u.userid
       WHERE a.questionid = $1
       ORDER BY a.created_at ASC`,
      [question.questionid]
    );

    const questionDetails = {
      question_uuid: question.question_uuid,
      questionid: question.questionid,
      title: question.title,
      description: question.description,
      views: question.views + 1, // because we incremented
      answer_count: question.answer_count,
      created_at: question.created_at,
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
  const questionUuid = req.params.questionUuid;
  const { title, description } = req.body;
  const userid = req.user.userid;

  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Title and description are required" });
  }

  try {
    // Check if question exists and belongs to user
    const { rows } = await pool.query(
      "SELECT userid FROM questions WHERE question_uuid = $1",
      [questionUuid]
    );

    const question = rows[0];
    if (!question)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found" });

    if (question.userid !== userid)
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "You can only edit your own questions" });

    // Update
    await pool.query(
      "UPDATE questions SET title=$1, description=$2 WHERE question_uuid=$3",
      [title, description, questionUuid]
    );

    return res
      .status(StatusCodes.OK)
      .json({ message: "✅ Question updated successfully" });
  } catch (error) {
    console.error("❌ Error updating question:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong: " + error.message,
    });
  }
}

module.exports = {
  postQuestion,
  getAllQuestions,
  getQuestionAndAnswer,
  updateQuestion,
};
