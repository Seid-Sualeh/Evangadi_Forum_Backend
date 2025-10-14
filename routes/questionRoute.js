const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { getAllQuestions, postQuestion ,getQuestionAndAnswer} = require("../controller/questionController");

// get all questions
router.get("/question", getAllQuestions);




// get single question
router.get("/question/:questionId", getQuestionAndAnswer);

// post a question
router.post("/question", authMiddleware, postQuestion);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware");
// const {
//   getAllQuestions,
//   getQuestionAndAnswer,
//   postQuestion,
//   getQuestionByUuid,
// } = require("../controller/questionController");

// router.get("/questions", getAllQuestions);
// router.get("/question/:questionId", getQuestionAndAnswer);
// router.get("/question-uuid/:uuid", getQuestionByUuid);
// router.post("/question", authMiddleware, postQuestion);






// // GET question + answers by UUID
// router.get("/question/:questionUuid", getQuestionAndAnswers);

// module.exports = router;


