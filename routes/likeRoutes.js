const express = require("express");
const { toggleLike, getLikesCount } = require("../controller/likeController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/like", authMiddleware, toggleLike);
router.get("/like/:answerid", getLikesCount);

module.exports = router;
