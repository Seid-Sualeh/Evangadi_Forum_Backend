const { createClient } = require("@supabase/supabase-js");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ======================== TOGGLE LIKE ========================
exports.toggleLike = async (req, res) => {
  const { answerid, userid } = req.body;

  if (!answerid || !userid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Missing data" });
  }

  try {
    // Check if already liked
    const { data: existing, error: selectError } = await supabase
      .from("answer_likes")
      .select("*")
      .eq("answerid", answerid)
      .eq("userid", userid);

    if (selectError) throw selectError;

    if (existing.length > 0) {
      // Unlike
      const { error: deleteError } = await supabase
        .from("answer_likes")
        .delete()
        .eq("answerid", answerid)
        .eq("userid", userid);

      if (deleteError) throw deleteError;

      return res.status(StatusCodes.OK).json({ liked: false });
    } else {
      // Like
      const { error: insertError } = await supabase
        .from("answer_likes")
        .insert([{ answerid, userid }]);

      if (insertError) throw insertError;

      return res.status(StatusCodes.OK).json({ liked: true });
    }
  } catch (err) {
    console.error("❌ Error toggling like:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

// ======================== GET TOTAL LIKES ========================
exports.getLikesCount = async (req, res) => {
  const { answerid } = req.params;

  try {
    const { count, error } = await supabase
      .from("answer_likes")
      .select("*", { count: "exact" })
      .eq("answerid", answerid);

    if (error) throw error;

    return res.status(StatusCodes.OK).json({ likeCount: count });
  } catch (err) {
    console.error("❌ Error fetching likes:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};
