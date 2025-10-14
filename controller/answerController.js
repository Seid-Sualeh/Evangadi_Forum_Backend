const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../config/dbConfig");


// Get Answers for a Question
async function getAnswer(req, res) {
  const questionid = req.params.question_id;
  try {
    const [rows] = await dbConnection.query(
      `SELECT 
          a.answerid, 
          a.userid AS answer_userid, 
          a.answer,
          a.createdAt,
          u.username
        FROM 
          answers a 
          INNER JOIN users u ON a.userid = u.userid
        WHERE 
          a.questionid = ?`,
      [questionid]
    );
    return res.status(StatusCodes.OK).json({ rows });
  } catch (err) {
    console.error("❌ Error fetching answers:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong, please try again later" });
  }
}

// Post Answers for a Question
async function postAnswer(req, res) {
  const { userid, answer, questionid } = req.body;

  // ✅ Create a UTC+3 timestamp
  const currentTimestamp = new Date();
  const adjustedDate = new Date(
    currentTimestamp.getTime() + 3 * 60 * 60 * 1000
  );
  const formattedTimestamp = adjustedDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  // ✅ Validate
  if (!userid || !answer || !questionid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

 

  try {
   
    await dbConnection.query(
      "INSERT INTO answers (userid, questionid, answer, createdAt) VALUES (?, ?, ?, ?)",
      [userid, questionid, answer, formattedTimestamp]
    );
    // console.log("✅ Answer posted successfully");
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "✅ Answer posted successfully" });
  } catch (err) {
    
    console.error("❌ Error posting answer:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        message: "Something went wrong, please try again later: " + err.message,
      });
  }
}

module.exports = {
  getAnswer,
  postAnswer,
};



