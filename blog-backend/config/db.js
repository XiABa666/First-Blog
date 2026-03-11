const mysql = require("mysql2");
// require=Node.js 自带的 模块加载函数
// require=把某个模块「加载进来」并执行它。
// "dotenv"读取 .env 文件，并把里面的变量放进 process.env
// .config()=让 dotenv 开始工作，读取 .env 文件。
require("dotenv").config();
// process=Node.js 提供的全局对象（不用引入也能用）
// process.env.DB_NAME 是从系统环境变量读取
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
module.exports = db.promise();