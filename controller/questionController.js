const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../config/dbConfig");
const { v4: uuidv4 } = require("uuid"); 

// ✅ Post a new question WITH UUID
async function postQuestion(req, res) {
  const { userid, title, description } = req.body;

  if (!userid || !title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  try {
    const questionUuid = uuidv4(); // ✅ Generate UUID

    await dbConnection.query(
      "INSERT INTO questions (userid, title, description, question_uuid) VALUES (?, ?, ?, ?)",
      [userid, title, description, questionUuid]
    );

    return res.status(StatusCodes.CREATED).json({
      message: "✅ Question posted successfully",
      questionUuid: questionUuid, // ✅ Return UUID to frontend
    });
  } catch (err) {
    console.error("❌ Error posting question:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong, please try again later: " + err.message,
    });
  }
}

// ✅ Get all questions - UPDATED to include UUID
async function getAllQuestions(req, res) {
  try {
    const [questions] = await dbConnection.query(`
      SELECT 
        q.questionid, 
        q.question_uuid,  -- ✅ ADD UUID
        q.title, 
        q.description, 
        q.createdAt, 
        q.views, 
        q.answer_count,
        q.userid,
        u.username 
      FROM questions q
      INNER JOIN users u ON q.userid = u.userid
      ORDER BY q.createdAt DESC
    `);

    return res.status(StatusCodes.OK).json({ message: questions });
  } catch (err) {
    console.error("❌ Error fetching questions:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong, please try again later",
    });
  }
}

// ✅ Get single question and all its answers - UPDATED to use UUID
async function getQuestionAndAnswer(req, res) {
  const questionUuid = req.params.questionUuid; // ✅ Changed from questionId to questionUuid

  try {
    // Increase view count using UUID
    await dbConnection.query(
      "UPDATE questions SET views = views + 1 WHERE question_uuid = ?",
      [questionUuid]
    );

    // Fetch question and answers using UUID
    const [rows] = await dbConnection.query(
      `SELECT 
          q.questionid, 
          q.question_uuid,  -- ✅ ADD UUID
          q.title, 
          q.description, 
          q.views, 
          q.answer_count,
          q.createdAt AS question_createdAt,
          u2.username AS question_username,
          u2.userid AS question_userid,
          a.answerid, 
          a.userid AS answer_userid, 
          a.answer, 
          a.createdAt AS answer_createdAt,
          u.username AS answer_username,
          a.comment_count
        FROM questions q
        LEFT JOIN answers a ON q.questionid = a.questionid
        LEFT JOIN users u ON u.userid = a.userid
        LEFT JOIN users u2 ON u2.userid = q.userid
        WHERE q.question_uuid = ?  -- ✅ Changed to use UUID
        ORDER BY a.createdAt DESC`,
      [questionUuid]
    );

    if (rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "❌ Question not found" });
    }

    // Structure question + answers
    const questionDetails = {
      id: rows[0].question_uuid, // ✅ Return UUID as ID for frontend
      questionid: rows[0].questionid, // ✅ Keep internal ID if needed
      title: rows[0].title,
      description: rows[0].description,
      views: rows[0].views,
      answer_count: rows[0].answer_count,
      createdAt: rows[0].question_createdAt,
      username: rows[0].question_username,
      userid: rows[0].question_userid,
      answers: rows
        .filter((a) => a.answerid !== null)
        .map((a) => ({
          answerid: a.answerid,
          userid: a.answer_userid,
          username: a.answer_username,
          answer: a.answer,
          createdAt: a.answer_createdAt,
          comment_count: a.comment_count ?? 0,
        })),
    };

    return res.status(StatusCodes.OK).json(questionDetails);
  } catch (error) {
    console.error("❌ Error fetching question:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching question details: " + error.message,
    });
  }
}

// ✅ UPDATE/EDIT QUESTION - UPDATED to use UUID
async function updateQuestion(req, res) {
  const questionUuid = req.params.questionUuid; // ✅ Changed to UUID
  const { title, description } = req.body;
  const userid = req.user.userid;

  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Title and description are required",
    });
  }

  try {
    // Check if question exists and user owns it using UUID
    const [question] = await dbConnection.query(
      "SELECT userid FROM questions WHERE question_uuid = ?",
      [questionUuid]
    );

    if (question.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Question not found",
      });
    }

    if (question[0].userid !== userid) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You can only edit your own questions",
      });
    }

    // Update the question using UUID
    await dbConnection.query(
      "UPDATE questions SET title = ?, description = ? WHERE question_uuid = ?",
      [title, description, questionUuid]
    );

    return res.status(StatusCodes.OK).json({
      message: "✅ Question updated successfully",
    });
  } catch (error) {
    console.error("❌ Error updating question:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong, please try again later",
    });
  }
}

module.exports = {
  postQuestion,
  getAllQuestions,
  getQuestionAndAnswer,
  updateQuestion,
};
