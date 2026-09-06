# 后端部署准备
运行环境：Node.js 24 或更新版本，包含内置 node:sqlite。服务没有第三方运行依赖。server/local.js 自动按顺序执行 .openai/drizzle 中的迁移。

1. 将本 backend 目录整体放到服务器 /opt/our-everyday，包含隐藏的 .openai 目录与 media。
2. 创建专用 journal 系统用户，并赋予目录读写权限。安装 Node.js 后，核对 our-everyday.service 中的实际 node 路径。
3. 以服务用户在此目录运行密码初始化。临时设置 INIT_HIM、INIT_HER 环境变量为你们约定的密码，再执行 node server/init-auth.mjs，完成后清除这两个变量。初始化只生成带随机盐的散列，不输出密码，不覆盖已存在的配置。
4. 将 .env.example 复制为 .env，填写 PUBLIC_ORIGIN=https://实际服务域名 与 PORT=8080。密码散列在 .local/auth.json，不需要写入 .env。
5. 用所附 systemd 服务配置启动常驻进程。手工测试可执行 node --env-file=.env server/http.js。服务只监听本机 127.0.0.1:8080。
6. 安装 Caddy，将 Caddyfile 占位域名替换为真实域名，DNS 指向服务器，确保 HTTPS 证书申请条件满足。由 Caddy 代理到本机端口。不要将 media 目录另行配置为公开静态目录，否则会绕过资源鉴权。
7. 每日备份 .local 数据库。SQLite 使用 WAL；运行中请用 SQLite 在线备份方式，不要只复制 journal.sqlite 而遗漏 WAL。备份必须加访问限制。
8. HTTPS 域名配置到微信后台后，再连接小程序。

服务限速默认基于连接地址。由于前面使用本机代理，目前两人共享每分钟 10 次失败登录额度，适合当前双人项目；扩展多用户前需改造可信代理 IP 与用户级限流。
资源响应为私有不缓存。视频采用完整下载，当前素材规模可用，大文件或并发增长后需要流式传输和资源限额改造。

## 迁移旧数据
当前没有旧线上数据库访问或导出结果，因此没有自动迁移任何旧日记。
迁移前冻结写入、导出备份、核对 entries 和 together 数据，再导入新服务；不要迁移 sessions 或 attempts。
必须保留日记 id、author、date、title、body、mood、version、updated；不要把所有日记作者改为导入者。
迁移后让原网页 /api、受保护 photos/videos 路径也指向同一服务，才能实现网页与小程序共享。
当前网站部署保持原状，此迁移包不会自动切换流量。
