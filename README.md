# 我们的日常

持续搭建的情侣生活网站，目前主题是「1000 天火花」。奶油色手账界面包含相册、视频、日记、情侣互动、旅行地图和纪念信。

## 开发与验证

使用 Node.js 24。安装依赖后运行 `npm run dev -- --port 4173`；`npm run build` 生成网页和 Worker 构建文件。

- `npm run test:sites`：Worker 路由验证。
- `node --test tests/auth-diary.test.mjs`：登录、日记与互动权限验证。
- `node wechat-migration/tests/verify.mjs`：小程序准备文件检查。

## 项目目录

- `src/`：网页界面、内容与交互。
- `public/`：图片、视频、地图。
- `server/`、`worker/`、`db/`：登录、共享数据和数据库。
- `wechat-migration/`：微信原生小程序及独立后端的迁移准备文件。

## 上线要求

GitHub 用于保存源码；GitHub Pages 只提供静态文件，不能运行此项目的登录、日记数据库和异地互动接口。完整上线需要支持 Worker + D1 的服务，或者 Node.js 24 后端及持久化数据库，并配置 HTTPS。

密码哈希、会话和数据库不进入仓库。生产环境需要配置 AUTH_HIM、AUTH_HER 和数据库绑定。小程序仍需自己的 AppID、HTTPS 服务地址和开发者工具真机验收，详见 wechat-migration 内说明。

注意：公开仓库中的照片和视频能够直接下载；网站登录仅保护网站接口，不能保护已公开的 GitHub 文件。
