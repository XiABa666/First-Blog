const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
    const { username, password } = req.body;
    if (password.length < 6) {
        return res.status(400).json({
            message: "密码至少6位"
        });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            "INSERT INTO users (username,password) VALUES(?,?)",
            [username, hashedPassword]
        );
        res.status(201).json({ message: "注册成功" });
    }
    catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "用户名已存在" });
        }
        console.error("发生错误：", err);
        res.status(500).json({ message: "服务器错误" });
    }
};
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query(
            "SELECT * FROM users WHERE username=?",
            [username]
        );
        if (rows.length === 0 || !(await bcrypt.compare(password, rows[0].password))) {
            return res.status(401).json({ message: "用户名或密码错误" });
        }
        const user = rows[0];
        if (user.status === 0) {
            return res.status(403).json({ message: "该账户已被禁用，请联系管理员" });
        }
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.json({ token });
    } catch (err) {
        console.error("发生错误：", err);
        res.status(500).json({ message: "服务器错误" });
    }
};