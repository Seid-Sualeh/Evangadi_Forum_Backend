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





// GET all questions
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Your question logic here
    res.json({ 
      message: 'Questions fetched successfully',
      questions: [] // your questions data
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;