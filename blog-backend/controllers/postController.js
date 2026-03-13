const db = require("../config/db");
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ message: "标题不能为空" });
        }
        if (!content || typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({ message: "内容不能为空" });
        }
        if (title.length > 100) return res.status(400).json({ message: "标题过长" });
        await db.query(
            "INSERT INTO posts(title, content, user_id) VALUES(?, ?, ?)",
            [title, content, req.user.id]
        );
        console.log(req.user); 
        res.json({ message: "文章发布成功" });
    } catch (error) {
        console.error("创建文章失败:", error);
        res.status(500).json({ message: "服务器错误，发布失败" });
    }
};
exports.getPosts = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.id"
        );
        res.json(rows);
    } catch (error) {
        console.error("获取文章列表失败:", error);
        res.status(500).json({ message: "服务器错误，无法获取文章" });
    }
};
exports.myposts = async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.query(
            "SELECT * FROM posts WHERE user_id = ?",
            [userId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "服务器错误" });
    }
};
exports.search= async (req, res) => {
    try {
        const keyword = req.query.keyword?.trim() || '';
        if (!keyword) {
            return res.json([]);
        }
        const [rows] = await db.query(
            "SELECT * FROM posts WHERE title LIKE ?",
            [`%${keyword}%`]
        );
        res.json(rows);
    } catch (error) {
        console.error("搜索帖子失败:", error);
        res.status(500).json({ message: "服务器错误，搜索失败" });
    }
};
exports.id=async(req, res) => {

    try {
        const id = req.params.id;
        await db.query(
            "UPDATE posts SET views = views + 1 WHERE id = ?",
            [id]
        )
        const [rows] = await db.query(
            "SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = ?",
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "文章不存在" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "服务器错误" });
    }
};
exports.like=async (req, res) => {
    try {
        const postId = req.params.id;


        const [post] = await db.query("SELECT id FROM posts WHERE id = ?", [postId]);
        if (post.length === 0) {
            return res.status(404).json({ message: "帖子不存在" });
        }

        await db.query("UPDATE posts SET likes = likes + 1 WHERE id = ?", [postId]);

        res.json({ message: "点赞成功" });
    } catch (error) {
        console.error("点赞失败:", error);
        res.status(500).json({ message: "服务器错误，点赞失败" });
    }
};
exports.dislike=async (req, res) => {
    try {
        const postId = req.params.id;


        const [post] = await db.query("SELECT id FROM posts WHERE id = ?", [postId]);
        if (post.length === 0) {
            return res.status(404).json({ message: "帖子不存在" });
        }

        await db.query("UPDATE posts SET dislikes = dislikes + 1 WHERE id = ?", [postId]);

        res.json({ message: "点踩成功" });
    } catch (error) {
        console.error("点踩失败:", error);
        res.status(500).json({ message: "服务器错误，点踩失败" });
    }
};