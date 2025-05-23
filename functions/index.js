// functions/index.js
// 此文件处理根路径请求，直接加载public/index.html的内容

export async function onRequest(context) {
    return new Response(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>安全管理交互学习平台</title>
    <link rel="stylesheet" href="/css/styles.css">
    <link rel="stylesheet" href="/css/modal.css">
</head>
<body>
    <div id="main-container">
        <header>
            <h1>安全管理交互学习平台</h1>
            <nav id="main-nav">
                <ul>
                    <li><a href="#home" class="nav-link active" data-route="home">首页</a></li>
                    <li><a href="#learn" class="nav-link" data-route="learn">学习</a></li>
                    <li><a href="#quiz" class="nav-link" data-route="quiz">测验</a></li>
                    <li><a href="#about" class="nav-link" data-route="about">关于</a></li>
                </ul>
            </nav>
        </header>
        
        <main id="app-content">
            <div id="loading-indicator">加载中...</div>
        </main>
        
        <footer>
            <p>&copy; 2024 安全管理交互学习平台. 保留所有权利.</p>
        </footer>
    </div>
    
    <!-- 模态框组件 -->
    <div id="modal-container" class="modal-hidden">
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modal-title">提示</h3>
                <button id="modal-close" class="modal-close-btn">&times;</button>
            </div>
            <div class="modal-body" id="modal-body">
                <!-- 模态框内容 -->
            </div>
            <div class="modal-footer">
                <button id="modal-cancel" class="btn btn-secondary">取消</button>
                <button id="modal-confirm" class="btn btn-primary">确认</button>
            </div>
        </div>
    </div>
    
    <!-- UI提示组件 -->
    <div id="toast-container"></div>
    
    <script>
        // 应用状态
        const appState = {
            currentRoute: 'home',
            isLoading: false,
            user: null,
            isAdmin: false,
            content: {},
            quizData: {}
        };
        
        // 初始化应用
        document.addEventListener('DOMContentLoaded', function() {
            initApp();
            recordVisit();
        });
        
        // 记录访问
        async function recordVisit() {
            try {
                const deviceInfo = {
                    type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
                    userAgent: navigator.userAgent
                };
                
                await fetch('/api/visit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ deviceInfo })
                });
            } catch (error) {
                console.error('无法记录访问统计:', error);
            }
        }
        
        // 应用初始化
        function initApp() {
            initRouter();
            loadContent();
            
            // 模态框关闭事件
            document.getElementById('modal-close').addEventListener('click', () => {
                document.getElementById('modal-container').classList.add('modal-hidden');
            });
            
            document.querySelector('.modal-backdrop').addEventListener('click', () => {
                document.getElementById('modal-container').classList.add('modal-hidden');
            });
        }
        
        // 其他应用代码将在这里加载
    </script>
    <script src="/js/app.js"></script>
</body>
</html>`, {
        status: 200,
        headers: {
            'Content-Type': 'text/html;charset=UTF-8',
            'Cache-Control': 'no-store'
        }
    });
} 