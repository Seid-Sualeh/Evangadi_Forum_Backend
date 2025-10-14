const express = require("express");
const { getAnswer, postAnswer } = require("../controller/answerController");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Get Answers for a Question
router.get("/answer/:questionUuid", getAnswer);

// Post Answers for a Question
router.post("/answer", authMiddleware, postAnswer);



module.exports = router;






// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware");
// const { getAnswer, postAnswer } = require("../controller/answerController");

// // Get answers for a question by UUID
// router.get("/answers/:questionUuid", getAnswer);

// // Post an answer for a question by UUID
// router.post("/answers", authMiddleware, postAnswer);
// // Post an answer for a question by UUID
// // router.post("/answers", authMiddleware, postAnswer);
// module.exports = router;