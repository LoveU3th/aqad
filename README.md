# 安全管理交互学习平台 - Cloudflare Pages 部署指南

本项目包含一个 Cloudflare Pages 应用，结合静态HTML和Functions API，用于驱动"安全管理交互学习平台"的前后端逻辑。

## 项目结构
.
├── functions/                  # Cloudflare Pages Functions 目录
│   ├── _worker.js              # Functions 入口文件，处理非静态请求
│   ├── router.js               # 页面请求的路由逻辑 (用于非API请求)
│   ├── api/                    # Pages Functions 路由文件目录
│   │   ├── visit.js            # /api/visit 端点的路由处理
│   │   ├── stats.js            # /api/stats 端点的路由处理
│   │   ├── stats/              # 嵌套 API 路由
│   │   │   └── clear.js        # /api/stats/clear 端点的路由处理
│   │   ├── questions.js        # /api/questions 端点的路由处理
│   │   ├── video.js            # /api/video 端点的路由处理
│   │   ├── video/              # 嵌套 API 路由
│   │   │   └── update.js       # /api/video/update 端点的路由处理
│   │   └── admin/              # 嵌套 API 路由
│   │       └── login.js        # /api/admin/login 端点的路由处理
│   ├── handlers/               # 存放具体的请求处理器
│   │   ├── api/                # API 请求的业务逻辑处理器
│   │   │   ├── adminAuthApi.js # 管理员认证的逻辑实现
│   │   │   ├── questionsApi.js # 题库相关请求的逻辑实现
│   │   │   ├── statsApi.js     # 统计数据相关请求的逻辑实现
│   │   │   ├── videoApi.js     # 视频相关请求的逻辑实现
│   │   │   └── visitApi.js     # 访问统计相关请求的逻辑实现
│   │   └── pageHandlers.js     # 页面请求处理器 (重定向处理)
│   └── services/               # 服务模块 (如认证、KV操作)
│       ├── authService.js      # 认证服务
│       └── kvService.js        # KV存储服务
├── public/                     # 静态资源目录
│   └── index.html              # 主HTML文件，包含前端代码
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 自动化部署配置文件
└── README.md                   # 本文件


**说明:**
* `public/` 目录包含静态HTML和前端资源，Cloudflare Pages会自动提供这些内容
* `functions/` 目录下的所有 `.js` 文件构成了 Cloudflare Functions，处理API请求和特殊路由
* `_worker.js` 是 Cloudflare Pages Functions 的默认入口点，它会处理所有未被静态资源匹配的请求
* `api/` 目录中的文件按照 Cloudflare Pages Functions 的路由约定，处理 API 路由的匹配、方法验证、认证和CORS配置
* `handlers/api/` 目录中的文件包含 API 请求的具体业务逻辑实现，被 `api/` 目录中的路由文件调用

## 架构说明

本项目采用前后端分离的架构设计：

1. **前端** (`public/index.html`):
   - 包含所有HTML、CSS和JavaScript代码
   - 提供用户界面和交互逻辑
   - 通过浏览器端JavaScript与API交互

2. **API层** (分为路由层和处理器层):
   - **路由层** (`functions/api/` 目录)：
     - 负责处理 HTTP 请求的路由匹配
     - 处理身份认证逻辑
     - 验证 HTTP 方法（GET、POST 等）
     - 配置 CORS 响应头
     - 将请求转发给处理器层

   - **处理器层** (`functions/handlers/api/` 目录)：
     - 实现具体的业务逻辑
     - 处理数据验证和转换
     - 与 KV 存储服务交互
     - 构建响应数据

3. **服务层** (`functions/services/` 目录)：
   - 提供共享的功能服务
   - 封装 KV 存储操作
   - 提供认证和授权功能

这种架构设计使前端和后端逻辑清晰分离，同时保持代码结构的清晰和可维护性。

## 部署到 Cloudflare Pages

### 1. 准备 GitHub 仓库

1.  确保你有一个 GitHub 仓库。
2.  将本项目的所有文件（`functions` 目录, `public` 目录, `.github` 目录, `README.md` 等）推送到你的仓库。

### 2. 连接到 Cloudflare Pages

1.  登录到你的 Cloudflare Dashboard。
2.  导航到 **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**。
3.  选择你的 GitHub 仓库，然后点击 **Begin setup**。
4.  **项目名称**：根据你的喜好设置。
5.  **生产分支**：选择你的主分支（通常是 `main` 或 `master`）。
6.  **构建设置**：
    * **框架预设 (Framework preset)**：选择 `None`。
    * **构建命令 (Build command)**：留空，因为我们不需要构建步骤。
    * **构建输出目录 (Build output directory)**：设为 `public`，指定静态文件的目录。
    * **根目录 (Root Directory)**: 保持默认 `/` 即可。
7.  **环境变量 (Environment variables)**：暂时不需要在这里设置 Worker 相关的环境变量，KV 绑定将在下一步进行。
8.  点击 **Save and Deploy**。

### 3. 配置 KV 命名空间绑定

部署完成后（或在部署过程中），你需要将之前在 Workers KV 中创建的命名空间绑定到你的 Pages 项目的 Functions 上：

1.  在 Cloudflare Dashboard 中，进入你刚创建的 Pages 项目。
2.  转到 **Settings** > **Functions** > **KV namespace bindings**。
3.  点击 **Add binding** 三次，分别为你的三个 KV 命名空间进行绑定：
    * **Variable name**: `SAFETY_CONTENT` -> **KV namespace**: 选择你对应的 `SAFETY_CONTENT` 命名空间。
    * **Variable name**: `SAFETY_STATS` -> **KV namespace**: 选择你对应的 `SAFETY_STATS` 命名空间。
    * **Variable name**: `SAFETY_ADMIN` -> **KV namespace**: 选择你对应的 `SAFETY_ADMIN` 命名空间。
4.  确保生产环境和预览环境都进行了正确的绑定。

### 4. 设置 GitHub Actions 实现自动化部署 (CI/CD)

提供的 `.github/workflows/deploy.yml` 文件将帮助你设置自动化部署。当代码推送到指定分支（例如 `main`）时，它会自动将你的 Pages 项目部署到 Cloudflare。

**获取 Cloudflare API Token:**

1.  在 Cloudflare Dashboard 中，进入 **My Profile** > **API Tokens**。
2.  点击 **Create Token**。
3.  选择 **Edit Cloudflare Workers** 模板 (或者创建一个自定义 Token，确保有 `Account.Pages` 的编辑权限和 `Account.Account Settings` 的读取权限，以及 Worker 相关的权限，如果未来需要更复杂的 Worker 操作)。
4.  配置 Token 的权限和区域。
5.  创建 Token 并**立即复制它**。你将无法再次看到它。

**在 GitHub 仓库中设置 Secrets:**

1.  在你的 GitHub 仓库中，转到 **Settings** > **Secrets and variables** > **Actions**。
2.  点击 **New repository secret** 添加以下两个 secrets：
    * `CLOUDFLARE_API_TOKEN`: 粘贴你刚刚创建的 Cloudflare API Token。
    * `CLOUDFLARE_ACCOUNT_ID`: 你的 Cloudflare Account ID (可以在 Cloudflare Dashboard 的任何域概览页面的右下角找到)。

**GitHub Actions 工作流 (`.github/workflows/deploy.yml`) 内容已在下方单独提供。**

推送此工作流文件到你的仓库后，每当 `main` 分支有新的提交，GitHub Actions 就会自动运行并部署你的应用到 Cloudflare Pages。

### 5. KV 数据准备

确保你的 KV 命名空间中有正确的数据：

* **`SAFETY_ADMIN`**: 存储管理员账户信息。
    * 例如：键 `admin_user` (或其他用户名)，值 `{"password": "your_secure_password_hash", "displayName": "管理员", "permissions": ["read", "write", "admin"]}`。
    * **重要**: 密码应该进行哈希处理后存储，而不是明文。当前的 Worker 代码中密码是明文比较，这在生产环境中是不安全的，应进行改进。
* **`SAFETY_CONTENT`**: 存储题库和视频链接。
    * 题库键: `active_safety_questions`, `unauthorized_operation_questions` (值为 JSON 数组)。
    * 视频链接键: `video_url_video1`, `video_url_video2` (值为视频 URL 字符串)。
* **`SAFETY_STATS`**: 存储统计数据，初始可以为空，Worker 会自动创建。

## 本地开发与测试 (使用 Wrangler)

虽然本项目是为 Pages Functions 设计的，但你仍然可以使用 Wrangler 进行本地开发和测试。

1.  安装 Wrangler CLI: `npm install -g wrangler`
2.  登录 Wrangler: `wrangler login`
3.  在项目根目录下运行本地开发服务器：
    ```bash
    wrangler pages dev public --kv SAFETY_CONTENT --kv SAFETY_STATS --kv SAFETY_ADMIN --port 8788
    ```

    这将同时提供静态文件和API功能。访问 `http://localhost:8788`。

## 注意事项

* **安全性**: 当前管理员密码验证是明文比较，这非常不安全。在生产环境中，应使用密码哈希和安全的比较方法。Token 的管理也应遵循安全最佳实践。
* **错误处理**: Worker 代码中的错误处理可以进一步增强。
* **CORS**: `Access-Control-Allow-Origin: '*'` 应谨慎使用，最好替换为你的实际前端域名。
* **构建设置**: 确保在Cloudflare Pages构建设置中将"构建输出目录"设置为`public`，这样Cloudflare Pages才能正确提供静态HTML文件。

## API 路由结构

项目采用了基于Cloudflare Pages Functions的文件路由结构，同时保留了处理器的分层设计：

* **路由文件** (`functions/api/` 目录): 处理路由匹配、认证、HTTP方法验证和CORS
  * `/api/visit` -> `functions/api/visit.js` -> 调用 `visitApi.js`
  * `/api/stats` -> `functions/api/stats.js` -> 调用 `statsApi.js`
  * `/api/stats/clear` -> `functions/api/stats/clear.js` -> 调用 `statsApi.js`
  * `/api/questions` -> `functions/api/questions.js` -> 调用 `questionsApi.js`
  * `/api/video` -> `functions/api/video.js` -> 调用 `videoApi.js`
  * `/api/video/update` -> `functions/api/video/update.js` -> 调用 `videoApi.js`
  * `/api/admin/login` -> `functions/api/admin/login.js` -> 调用 `adminAuthApi.js`

* **处理器文件** (`functions/handlers/api/` 目录): 实现具体的业务逻辑和数据处理

这种结构既符合Cloudflare Pages Functions的路由要求，又保持了代码的清晰分层。

## 常见问题排查

### 网站内容不显示或空白

如果部署后网站只显示导航栏和底部信息，但内容区域为空，检查：

1. 确保构建输出目录设置为 `public`，这样Cloudflare Pages才能提供正确的静态文件。
2. 确认KV绑定已正确配置，因为网站内容可能依赖于KV存储的数据。
3. 检查浏览器控制台是否有任何JavaScript错误或网络请求失败。

### API请求返回405错误

如果API请求返回405 Method Not Allowed错误，检查：

1. 确保已按照Cloudflare Pages Functions的文件路由结构创建了对应的API文件，每个API路径都需要一个对应的JS文件。
2. 检查API文件中是否正确导出了对应的处理函数（如`onRequestPost`、`onRequestGet`等）。
3. 确认路由文件正确导入并调用了处理器文件中的函数。
