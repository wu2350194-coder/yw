# 我们的日常 · 微信小程序迁移包
这是原生微信小程序准备版，不是网页套壳。原网站保留不变；本目录没有发布到微信，也没有更改线上数据。

## 你可以怎样使用
1. 安装并打开微信开发者工具，导入本目录（包含 project.config.json 的目录）。
2. 填入你自己的小程序 AppID。目前为空，避免误用别人的账号。无需将 AppSecret 放入任何前端文件。
3. 部署 backend 目录中的服务，配置 HTTPS 域名。步骤见 backend/DEPLOY.md。
4. 在 miniprogram/config.js 的 apiBase 填写服务域名，例如 https://api.your-domain.com，不加 /api。
5. 在小程序管理后台配置该服务为 request 与 downloadFile 合法域名。当前域名要求、主体要求和上线审核请以微信后台及官方文档为准。
6. 在开发者工具运行，并用两台手机分别登录，按 ACCEPTANCE.md 联调。之后再上传体验版和提交审核。

## 已准备的内容
- 奶油色圆角原生页面：首页、按类别相册、日记新增与作者编辑、默契问答、交换心里话、同步抽签、旅行地图、视频。
- 26 张保留照片和 2 个视频在 backend/media；移除过的照片不在本包中。
- 同一份后端认证、日记与互动逻辑，附数据库迁移和验证脚本。
- 只标注诸暨和绍兴，不申请用户实时位置。
- 小程序通过 wx.request 手动携带会话 Cookie，图片和视频使用带认证的 wx.downloadFile 下载后展示。
- 会话只保存在运行内存，重新启动小程序需再次登录；退出登录清理已下载的临时资源。
- 相册按需点开图片，避免一次下载全部私人照片。视频先下载再播放，目前不提供边下载边播。

## 尚未完成 / 不要误认为已完成
- AppID、真实 HTTPS 服务、微信域名配置和真机审核尚未完成。当前公开 Sites 域名此前被自动访问检查拦截，不作为已验证的小程序后端。
- 小程序页面不是 React 网页的像素级复制；旅行页使用原生地图，尚未复制网页的微 3D 地图；心动动画使用轻量 CSS 浮动。
- 现有云端日记及互动记录没有自动复制。本包只含数据库结构，不含任何已有会话或日记数据库。若要网站和小程序共享同一空间，必须让两端连接同一个后端数据库。
- 本服务是固定一对情侣的私用模型，不是多情侣注册平台。不要开放注册给其他情侣共用这两个人的数据库。
- 日记冲突时保留输入，需重新加载原记录后人工合并。互动仅保存每种玩法当前一轮，开启下一轮会替换上一轮。
- 日记草稿只在页面内存中，关闭小程序前请保存。

## 配置清单
| 项目 | 文件或位置 |
| --- | --- |
| 小程序 AppID | project.config.json |
| 服务地址 | miniprogram/config.js |
| 两人登录密码 | 仅在服务器初始化，不写入小程序 |
| 域名与端口 | backend/.env.example |
| HTTPS 反向代理 | backend/Caddyfile |
| Linux 常驻服务 | backend/our-everyday.service |
| 日记和会话数据库 | 部署后 backend/.local/journal.sqlite |
| 内容标题和照片清单 | miniprogram/data/content.js |
| 互动题目与抽签文案 | miniprogram/data/play.js |

## 验证
在本目录运行：
- node tests/verify.mjs
- node --test tests/shared-api.test.mjs

已执行结构/语法、Cookie 传递模拟、双角色日记读写权限、隐藏答案、重复提交和旧轮次拒绝验证。
未使用微信开发者工具编译或真机验证，因此仍需完成验收单。

## 官方参考
- 网络能力：https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html
- wx.request：https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
- 项目配置：https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html
- 微信官方示例：https://github.com/wechat-miniprogram/miniprogram-demo
