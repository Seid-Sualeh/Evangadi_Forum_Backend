const express = require("express");
const {
  getAnswer,
  postAnswer,
  updateAnswer,
} = require("../controller/answerController");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Get Answers for a Question
router.get("/answer/:questionUuid", getAnswer);

// Post Answers for a Question
router.post("/answer", authMiddleware, postAnswer);

// ✅ UPDATE/EDIT Answer (NEW ROUTE)
router.put("/answer/:answerid", authMiddleware, updateAnswer);

module.exports = router;
