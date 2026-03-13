<h1 align="center">Vue+Node.js博客简介</h1>
<h2 >一、使用方法</h2>
<ul>
<li>首先在blog-backend文件夹建立.env文件并配置与Mysql的连接信息</li>
<li>
使用管理员身份打开命令提示符并切换至blog-backend文件夹，执行以下安装命令
<ol>npm install cors bcryptjs jsonwebtoken</ol>
<ol>npm install mysql2</ol>
</li>
<li>
使用管理员身份打开命令提示符并切换至blog-frontend-1文件夹，执行以下安装命令
<ol>npm install</ol>
</li>
<li>在blog-backend文件夹的命令提示符执行"node app.js"</li>
<li>在blog-frontend-1文件夹的命令提示符执行"npm run dev"</li>
<li>打开http://localhost:5173/</li>
</ul>
<h2>二、框架使用</h2>
<ul>
<li>前端使用Vue3，后端采取Node.js，使用Mysql数据库</li>
<li>后端采取Nodejs的Express框架，使用Cors模块解决跨域问题，Bcryptjs进行密码加密，使用Jsonwebtoken进行身份验证，db.js进行数据库连接，.env进行用户保护</li>
<li>前端用axios调用api，vue-router负责前端页面切换和导航</li>
</ul>
<h2>三、功能介绍</h2>
<ul>
<li>基本的登录与注册，以及用户的身份验证</li>
<li>发布与搜索文章</li>
<li>对文章进行评论</li>
<li>对文章和评论的点赞、点踩</li>
<li>用户封禁功能</li>
</ul>