# 安全管理交互学习平台 - Cloudflare Pages 部署指南

本项目包含一个 Cloudflare Worker 的模块化版本，用于驱动“安全管理交互学习平台”的前后端逻辑，并通过 Cloudflare Pages 进行部署。

## 项目结构
.
├── functions/                  # Cloudflare Pages Functions 目录
│   ├── _worker.js              # Functions 入口文件，处理所有请求
│   ├── htmlContent.js          # 存储主 HTML 内容的模块
│   ├── router.js               # API 和页面请求的路由逻辑
│   ├── handlers/               # 存放具体的请求处理器
│   │   ├── api/                # API 请求处理器
│   │   │   ├── adminAuthApi.js
│   │   │   ├── questionsApi.js
│   │   │   ├── statsApi.js
│   │   │   ├── videoApi.js
│   │   │   └── visitApi.js
│   │   └── pageHandlers.js     # 页面请求处理器 (如 /admin, /)
│   └── services/               # 服务模块 (如认证、KV操作)
│       ├── authService.js
│       └── kvService.js
├── public/                     # 静态资源目录 (可选，如果 HTML 分离)
│   └── index.html              # (如果将 INDEX_HTML 作为静态文件)
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 自动化部署配置文件
└── README.md                   # 本文件


**说明:**
* `functions/` 目录下的所有 `.js` 文件构成了 Cloudflare Function。
* `_worker.js` 是 Cloudflare Pages Functions 的默认入口点，它会处理所有传入的请求，并将它们分派给相应的处理器。
* `htmlContent.js` 目前用于存储和导出嵌入在 Worker 中的 `INDEX_HTML`。未来可以考虑将 `index.html` 移至 `public/` 目录，由 Pages 直接提供静态服务，Worker 则专注于 API。

## 部署到 Cloudflare Pages

### 1. 准备 GitHub 仓库

1.  确保你有一个 GitHub 仓库。
2.  将本项目的所有文件（`functions` 目录, `.github` 目录, `README.md` 等）推送到你的仓库。

### 2. 连接到 Cloudflare Pages

1.  登录到你的 Cloudflare Dashboard。
2.  导航到 **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**。
3.  选择你的 GitHub 仓库，然后点击 **Begin setup**。
4.  **项目名称**：根据你的喜好设置。
5.  **生产分支**：选择你的主分支（通常是 `main` 或 `master`）。
6.  **构建设置**：
    * **框架预设 (Framework preset)**：选择 `None`。
    * **构建命令 (Build command)**：留空或根据你的项目需求（如果未来有构建步骤）。
    * **构建输出目录 (Build output directory)**：如果你的 `index.html` 在 `public` 目录下，则设置为 `public`。如果 `index.html` 由 Worker 提供（如当前模块化方案），则此设置可以留空或设为项目根目录（尽管 Pages 可能不会直接使用它来服务根路径的 HTML，而是由 `functions/_worker.js` 处理）。
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
    (如果 `index.html` 在 `public` 目录，否则直接 `wrangler pages dev --kv ...`)
    你需要确保本地有对应的 KV 命名空间预览或模拟数据。

    或者，因为我们目前将 HTML 内容也由 `_worker.js` 提供，你可以更简单地运行：
    ```bash
    wrangler dev functions/_worker.js --kv SAFETY_CONTENT --kv SAFETY_STATS --kv SAFETY_ADMIN --local --port 8788
    ```
    这会直接运行 `_worker.js`。访问 `http://localhost:8788`。

## 注意事项

* **安全性**: 当前管理员密码验证是明文比较，这非常不安全。在生产环境中，应使用密码哈希和安全的比较方法。Token 的管理也应遵循安全最佳实践。
* **错误处理**: Worker 代码中的错误处理可以进一步增强。
* **静态资源**: 将 `INDEX_HTML` 移至 `public/index.html` 并由 Pages 直接服务是更标准的做法。届时，`functions/_worker.js` 中的 `handleAppRequest` 逻辑可以移除或调整为仅处理 API。
* **CORS**: `Access-Control-Allow-Origin: '*'` 应谨慎使用，最好替换为你的实际前端域名。
