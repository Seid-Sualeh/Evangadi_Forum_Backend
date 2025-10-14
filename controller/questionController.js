const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../config/dbConfig");
// const { v4: uuidv4 } = require("uuid");
// post questions / ask questions
async function postQuestion(req, res) {
  const { userid, title, description } = req.body;
  // Create a new date object
  const currentTimestamp = new Date();

  // Adjust the time by UTC+3 hours
  const adjustedDate = new Date(
    currentTimestamp.getTime() + 3 * 60 * 60 * 1000
  );

  // Format the date as 'YYYY-MM-DD HH:mm:ss'
  const formattedTimestamp = adjustedDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  if (!userid || !title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  try {
    await dbConnection.query(
      "insert into questions (userid, title, description, createdAt) values ( ?, ?, ?, ?)",
      [userid, title, description, formattedTimestamp]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "✅ Question posted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "something went wrong, please try again later: " + err.message,
    });
  }
}

// get all questions
async function getAllQuestions(req, res) {
  try {
    const [questions] =
      await dbConnection.query(`select q.questionid, q.title, q.description,q.createdAt, u.username from questions q   
     inner join users u on q.userid = u.userid  order by q.createdAt desc`);
    return res.status(StatusCodes.OK).json({
      message: questions,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "something went wrong, please try again later" });
  }
}

// get single question and answers
async function getQuestionAndAnswer(req, res) {
  const questionid = req.params.questionId;

  try {
    const [rows] = await dbConnection.query(
      `SELECT 
          q.questionid, 
          q.title, 
          q.description, 
          q.createdAt AS question_createdAt,
          u2.username as question_username,
          a.answerid, 
          a.userid AS answer_userid, 
          a.answer,
          a.createdAt,
          u.username as answer_username
       FROM 
          questions q   
       LEFT JOIN 
          answers a ON q.questionid = a.questionid
          LEFT JOIN users u on u.userid = a.userid
          left join users u2 on u2.userid = q.userid
       WHERE 
          q.questionid = ?
          order by a.createdAt desc
          `,
      [questionid]
    );

    // Check if the question exists
    if (rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found" });
    }

    const questionDetails = {
      id: rows[0].questionid,
      title: rows[0].title,
      description: rows[0].description,
      qtn_createdAt: rows[0].question_createdAt,
      qtn_username: rows[0].question_username,

      answers: rows
        .map((answer) => ({
          answerid: answer.answerid,
          userid: answer.answer_userid,
          username: answer.answer_username,
          answer: answer.answer,
          createdAt: answer.createdAt,
        }))
        .filter((answer) => answer.answerid !== null), // Filter out any null answers
    };

    res.status(StatusCodes.OK).json(questionDetails);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching question details: " + error.message });
  }
}
module.exports = { postQuestion, getAllQuestions, getQuestionAndAnswer };














