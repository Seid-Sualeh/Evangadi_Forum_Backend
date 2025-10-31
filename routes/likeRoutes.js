const express = require("express");

const { toggleLike, getLikesCount } = require("../controller/likeController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, toggleLike);
router.get("/:answerid", getLikesCount);

module.exports = router;





