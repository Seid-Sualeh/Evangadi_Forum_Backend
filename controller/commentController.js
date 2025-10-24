const { createClient } = require("@supabase/supabase-js");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ======================== ADD COMMENT ========================
exports.addComment = async (req, res) => {
  const { answerid, userid, comment } = req.body;

  if (!answerid || !userid || !comment) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  try {
    // 1️⃣ Insert the comment
    const { error: insertError } = await supabase
      .from("comments")
      .insert([{ answerid, userid, comment }]);

    if (insertError) throw insertError;

    // 2️⃣ Increase the comment_count in the related answer
    const { error: updateError } = await supabase
      .from("answers")
      .update({ comment_count: supabase.raw("COALESCE(comment_count, 0) + 1") })
      .eq("answerid", answerid);

    if (updateError) throw updateError;

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "✅ Comment added successfully" });
  } catch (err) {
    console.error("❌ Error adding comment:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

// ======================== GET COMMENTS BY ANSWER ========================
exports.getCommentsByAnswer = async (req, res) => {
  const { answerid } = req.params;

  try {
    const { data: comments, error } = await supabase
      .from("comments")
      .select("commentid, comment, createdAt, users(username)")
      .eq("answerid", answerid)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    return res.status(StatusCodes.OK).json(comments);
  } catch (err) {
    console.error("❌ Error fetching comments:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};
