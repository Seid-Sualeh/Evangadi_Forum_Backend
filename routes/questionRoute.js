const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllQuestions,
  postQuestion,
  getQuestionAndAnswer,
  updateQuestion,
} = require("../controller/questionController");

// get all questions
router.get("/question", getAllQuestions);

// get single question - ✅ CHANGED to use UUID
router.get("/question/:questionUuid", getQuestionAndAnswer);

// post a question
router.post("/question", authMiddleware, postQuestion);

// ✅ UPDATE/EDIT Question - CHANGED to use UUID
router.put("/question/:questionUuid", authMiddleware, updateQuestion);

module.exports = router;
