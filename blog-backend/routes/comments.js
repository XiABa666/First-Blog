const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");
const { getComments, createComments,like,dislike}=require("../controllers/commentsController")
router.get("/:postId", getComments);
router.post("/:postId", auth, createComments);
router.post("/:id/like", like);
router.post("/:id/dislike", dislike);
module.exports = router;