const { StatusCodes } = require("http-status-codes");
const { createClient } = require("@supabase/supabase-js");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

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

    const { data, error } = await supabase
      .from("questions")
      .insert([{ userid, title, description, question_uuid: questionUuid }]);

    if (error) throw error;

    return res.status(StatusCodes.CREATED).json({
      message: "✅ Question posted successfully",
      questionUuid,
    });
  } catch (err) {
    console.error("❌ Error posting question:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong, please try again later: " + err.message,
    });
  }
}

// ======================== GET ALL QUESTIONS ========================
async function getAllQuestions(req, res) {
  try {
    const { data: questions, error } = await supabase
      .from("questions")
      .select("questionid, question_uuid, title, description, createdAt, views, answer_count, userid, users(username)")
      .order("createdAt", { ascending: false });

    if (error) throw error;

    return res.status(StatusCodes.OK).json({ message: questions });
  } catch (err) {
    console.error("❌ Error fetching questions:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong, please try again later",
    });
  }
}

// ======================== GET SINGLE QUESTION AND ANSWERS ========================
async function getQuestionAndAnswer(req, res) {
  const questionUuid = req.params.questionUuid;

  try {
    // Increase view count
    const { error: viewError } = await supabase
      .from("questions")
      .update({ views: supabase.raw("views + 1") })
      .eq("question_uuid", questionUuid);

    if (viewError) throw viewError;

    // Fetch question + answers + user info
    const { data, error } = await supabase
      .from("questions")
      .select(`
        questionid,
        question_uuid,
        title,
        description,
        views,
        answer_count,
        createdAt,
        userid,
        users!inner(username),
        answers(
          answerid,
          userid,
          answer,
          createdAt,
          comment_count,
          users(username)
        )
      `)
      .eq("question_uuid", questionUuid)
      .single();

    if (error) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "❌ Question not found" });
    }

    // Format answers
    const formattedAnswers = data.answers?.map((a) => ({
      answerid: a.answerid,
      userid: a.userid,
      username: a.users.username,
      answer: a.answer,
      createdAt: a.createdAt,
      comment_count: a.comment_count ?? 0,
    })) || [];

    const questionDetails = {
      id: data.question_uuid,
      questionid: data.questionid,
      title: data.title,
      description: data.description,
      views: data.views,
      answer_count: data.answer_count,
      createdAt: data.createdAt,
      username: data.users.username,
      userid: data.userid,
      answers: formattedAnswers,
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
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Title and description are required",
    });
  }

  try {
    // Check if question exists and belongs to user
    const { data: question, error } = await supabase
      .from("questions")
      .select("userid")
      .eq("question_uuid", questionUuid)
      .single();

    if (error) return res.status(StatusCodes.NOT_FOUND).json({ message: "Question not found" });
    if (question.userid !== userid) return res.status(StatusCodes.FORBIDDEN).json({ message: "You can only edit your own questions" });

    // Update
    const { error: updateError } = await supabase
      .from("questions")
      .update({ title, description })
      .eq("question_uuid", questionUuid);

    if (updateError) throw updateError;

    return res.status(StatusCodes.OK).json({ message: "✅ Question updated successfully" });
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
