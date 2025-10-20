const express = require("express");
const {
  addComment,
  getCommentsByAnswer,
} = require("../controller/commentController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/comment", authMiddleware, addComment);
router.get("/comment/:answerid", getCommentsByAnswer);

module.exports = router;



