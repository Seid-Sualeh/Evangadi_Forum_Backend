const { createClient } = require("@supabase/supabase-js");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ======================== GET ALL ANSWERS ========================
exports.getAnswer = async (req, res) => {
  const questionUuid = req.params.question_id;

  try {
    // Convert UUID to numeric question ID
    const { data: question, error: qError } = await supabase
      .from("questions")
      .select("questionid")
      .eq("question_uuid", questionUuid)
      .single();

    if (qError || !question) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Question not found",
      });
    }

    const { data: answers, error } = await supabase
      .from("answers")
      .select(
        `answerid, userid AS answer_userid, answer, createdAt, users(username),
         comments(commentid)` // count of comments
      )
      .eq("questionid", question.questionid)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    // Include comment counts
    const formattedAnswers = answers.map((a) => ({
      ...a,
      comment_count: a.comments ? a.comments.length : 0,
    }));

    return res.status(StatusCodes.OK).json({ rows: formattedAnswers });
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
      const { data: question, error: qError } = await supabase
        .from("questions")
        .select("questionid")
        .eq("question_uuid", questionid)
        .single();

      if (qError || !question) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Question not found",
        });
      }

      numericQuestionId = question.questionid;
    }

    // Insert answer
    const { error: insertError } = await supabase
      .from("answers")
      .insert([{ userid, questionid: numericQuestionId, answer }]);

    if (insertError) throw insertError;

    // Increment answer_count on question
    const { error: updateError } = await supabase
      .from("questions")
      .update({ answer_count: supabase.raw("COALESCE(answer_count,0)+1") })
      .eq("questionid", numericQuestionId);

    if (updateError) throw updateError;

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
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Answer text is required",
    });
  }

  try {
    const { data: existingAnswer, error } = await supabase
      .from("answers")
      .select("userid")
      .eq("answerid", answerid)
      .single();

    if (error || !existingAnswer) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Answer not found",
      });
    }

    if (existingAnswer.userid !== userid) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You can only edit your own answers",
      });
    }

    const { error: updateError } = await supabase
      .from("answers")
      .update({ answer })
      .eq("answerid", answerid);

    if (updateError) throw updateError;

    return res.status(StatusCodes.OK).json({
      message: "✅ Answer updated successfully",
    });
  } catch (err) {
    console.error("❌ Error updating answer:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong, please try again later",
    });
  }
};
