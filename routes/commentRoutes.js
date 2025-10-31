const express = require("express");
const {
  addComment,
  getCommentsByAnswer,
} = require("../controller/commentController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, addComment);
router.get("/:answerid", getCommentsByAnswer);

module.exports = router;



