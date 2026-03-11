const db = require("../config/db");
exports.getComments= async (req, res) => {
     try {
    const { postId } = req.params;
    const [rows] = await db.query(
      `SELECT comments.*, users.username 
       FROM comments 
       JOIN users ON comments.user_id = users.id 
       WHERE post_id = ? 
       ORDER BY created_at DESC`,
      [postId]
    );
    res.json(rows);
  } catch (error) {
    console.error("获取评论失败:", error);
    res.status(500).json({ message: "服务器错误，无法获取评论" });
  }
};
exports.createComments=async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "评论内容不能为空" });
    }

    await db.query(
      "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
      [postId, userId, content]
    );

    res.json({ message: "评论成功" });
  } catch (error) {
    console.error("发表评论失败:", error);
    res.status(500).json({ message: "服务器错误，评论发布失败" });
  }
};
exports.like= async (req, res) => {

  try {
    const { id } = req.params;

    // 可选：检查评论是否存在
    const [existing] = await db.query("SELECT id FROM comments WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "评论不存在" });
    }

    await db.query(
      "UPDATE comments SET likes = likes + 1 WHERE id = ?",
      [id]
    );

    res.json({ message: "点赞成功" });
  } catch (error) {
    console.error("点赞失败:", error);
    res.status(500).json({ message: "服务器错误，点赞失败" });
  }

};
exports.dislike= async (req, res) => {

   try {
    const { id } = req.params;

    // 可选：检查评论是否存在
    const [existing] = await db.query("SELECT id FROM comments WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "评论不存在" });
    }

    await db.query(
      "UPDATE comments SET dislikes = dislikes + 1 WHERE id = ?",
      [id]
    );

    res.json({ message: "点踩成功" });
  } catch (error) {
    console.error("点踩失败:", error);
    res.status(500).json({ message: "服务器错误，点踩失败" });
  }

};