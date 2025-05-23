// 路由初始化
function initRouter() {
    // 获取当前hash或默认为home
    const hash = window.location.hash.substring(1) || 'home';

    // 监听URL变化
    window.addEventListener('hashchange', function () {
        const newHash = window.location.hash.substring(1) || 'home';
        routeToPage(newHash);
    });

    // 为导航链接添加点击事件
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const route = this.getAttribute('data-route');
            window.location.hash = route;
            routeToPage(route);
        });
    });

    // 初始导航到当前hash页面
    routeToPage(hash);
    console.log('路由系统初始化完成');
}

// 页面路由处理
function routeToPage(route) {
    // 更新导航高亮
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('data-route') === route) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 显示对应内容
    loadPageContent(route);
}

// 加载页面内容
async function loadPageContent(route) {
    // 显示加载指示器
    showLoading();

    try {
        // 根据路由加载对应内容
        let content = '';

        switch (route) {
            case 'home':
                content = `
                    <div class="page-section">
                        <h2>欢迎来到安全管理交互学习平台</h2>
                        <p>这是一个帮助您学习和理解工作场所安全管理重要性的平台。</p>
                        <div class="card-container">
                            <div class="feature-card">
                                <h3>学习</h3>
                                <p>通过互动内容了解安全管理基础知识</p>
                                <a href="#learn" class="btn btn-primary">开始学习</a>
                            </div>
                            <div class="feature-card">
                                <h3>测验</h3>
                                <p>测试您对安全管理概念的理解</p>
                                <a href="#quiz" class="btn btn-primary">参加测验</a>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'learn':
                content = `
                    <div class="page-section">
                        <h2>安全管理学习</h2>
                        <p>选择下面的主题开始学习：</p>
                        <div class="lesson-grid">
                            <div class="lesson-card">
                                <h3>工作场所安全基础</h3>
                                <p>了解工作场所安全的基本原则和实践</p>
                                <a href="#lesson/1" class="btn btn-outline">查看课程</a>
                            </div>
                            <div class="lesson-card">
                                <h3>风险评估</h3>
                                <p>学习如何识别和评估工作场所的安全风险</p>
                                <a href="#lesson/2" class="btn btn-outline">查看课程</a>
                            </div>
                            <div class="lesson-card">
                                <h3>应急响应程序</h3>
                                <p>了解如何制定和实施有效的应急响应计划</p>
                                <a href="#lesson/3" class="btn btn-outline">查看课程</a>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'quiz':
                content = `
                    <div class="page-section">
                        <h2>安全知识测验</h2>
                        <p>测试您对安全管理的理解：</p>
                        <div class="quiz-container">
                            <div class="quiz-intro">
                                <h3>准备好挑战了吗？</h3>
                                <p>这个测验包含10个问题，涵盖安全管理的各个方面。</p>
                                <button id="start-quiz" class="btn btn-primary">开始测验</button>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'about':
                content = `
                    <div class="page-section">
                        <h2>关于平台</h2>
                        <p>安全管理交互学习平台旨在为各行业的专业人士提供关于工作场所安全管理的教育资源。</p>
                        <h3>我们的使命</h3>
                        <p>通过提供高质量、互动性强的学习体验，提高工作场所的安全意识和实践。</p>
                        <h3>联系我们</h3>
                        <p>如果您有任何问题或建议，请发送电子邮件至：<a href="mailto:contact@safety-platform.com">contact@safety-platform.com</a></p>
                    </div>
                `;
                break;
            default:
                // 如果是未知路由，显示首页
                window.location.hash = 'home';
                return;
        }

        // 更新内容
        document.getElementById('app-content').innerHTML = content;

        // 如果是测验页面，添加开始测验按钮事件
        if (route === 'quiz') {
            document.getElementById('start-quiz')?.addEventListener('click', startQuiz);
        }

    } catch (error) {
        console.error('加载页面内容时出错:', error);
        document.getElementById('app-content').innerHTML = `
            <div class="error-message">
                <h2>加载内容时出错</h2>
                <p>请稍后再试或刷新页面。</p>
            </div>
        `;
    } finally {
        // 隐藏加载指示器
        hideLoading();
    }
}

// 加载内容
async function loadContent() {
    try {
        // 这里可以添加从API获取内容的逻辑
        console.log('内容加载完成');
    } catch (error) {
        console.error('加载内容时出错:', error);
    }
}

// 显示/隐藏加载指示器
function showLoading() {
    appState.isLoading = true;
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
}

function hideLoading() {
    appState.isLoading = false;
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

// 测验功能示例
function startQuiz() {
    const quizContainer = document.querySelector('.quiz-container');
    quizContainer.innerHTML = `
        <div class="quiz-question">
            <h3>问题 1/10</h3>
            <p>以下哪项不是工作场所安全管理的基本原则？</p>
            <div class="quiz-options">
                <label class="quiz-option">
                    <input type="radio" name="q1" value="a"> 
                    A. 识别潜在危害
                </label>
                <label class="quiz-option">
                    <input type="radio" name="q1" value="b"> 
                    B. 制定安全程序
                </label>
                <label class="quiz-option">
                    <input type="radio" name="q1" value="c"> 
                    C. 忽略小问题，专注于重大风险
                </label>
                <label class="quiz-option">
                    <input type="radio" name="q1" value="d"> 
                    D. 员工安全培训
                </label>
            </div>
            <button class="btn btn-primary quiz-next">下一题</button>
        </div>
    `;

    // 添加下一题按钮事件
    document.querySelector('.quiz-next').addEventListener('click', () => {
        alert('这是示例测验。在实际应用中，这里将进入下一个问题。');
    });
} 