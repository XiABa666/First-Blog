const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors(
    {
        origin: [
            "http://localhost:5173",
            "http://localhost:3000",
        ]
    }
));
// 让 Express 能自动读取前端发来的 JSON 数据
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/post"));
app.use("/api/comments", require("./routes/comments"));
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});