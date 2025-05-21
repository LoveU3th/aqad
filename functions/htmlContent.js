// HTML 内容模块
export const INDEX_HTML = `<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="description" content="安全管理交互式学习平台 - 通过视频学习和知识测试提升安全意识">
    <meta name="theme-color" content="#0056b3">
    <title>安全管理交互学习平台</title>
    <style>
        /* 基础样式 */
        :root {
            --primary-color: #0056b3;
            --secondary-color: #28a745;
            --danger-color: #dc3545;
            --light-color: #f8f9fa;
            --dark-color: #343a40;
            --transition-speed: 0.3s;
            --loading-color: #0056b3;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
            line-height: 1.6;
            color: var(--dark-color);
            background-color: #f5f5f5;
            overflow-x: hidden;
        }

        /* 布局容器 */
        .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 15px;
        }

        /* 导航栏 */
        .nav-container {
            background-color: var(--primary-color);
            color: white;
            padding: 10px 0;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .nav-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .nav-title {
            font-size: 1.2rem;
            font-weight: bold;
            white-space: nowrap; /* 防止标题换行 */
        }

        .nav-links {
            display: flex;
            gap: 10px; /* 减小间距 */
            flex-wrap: nowrap; /* 防止换行 */
            overflow-x: auto; /* 如果内容过多则允许横向滚动 */
            -webkit-overflow-scrolling: touch; /* iOS 滚动优化 */
        }

        .nav-link {
            color: white;
            text-decoration: none;
            padding: 5px 8px; /* 调整内边距 */
            border-radius: 4px;
            transition: background-color var(--transition-speed);
            font-size: 0.9rem; /* 略微减小字体 */
            white-space: nowrap; /* 防止链接内文字换行 */
        }

        .nav-link:hover, .nav-link.active {
            background-color: rgba(255, 255, 255, 0.2);
        }

        /* 页面容器 */
        .page-container {
            margin-top: 70px; /* 略微增加导航栏高度后的间距 */
            min-height: calc(100vh - 130px); 
            padding: 20px 0;
            transition: opacity var(--transition-speed);
        }
        
        .page > h1 {
            font-size: 1.3rem; /* 调整移动端标题大小 */
            margin-bottom: 15px; /* 确保标题和视频播放器之间有间距 */
            text-align: center;
        }


        /* 页面 */
        .page {
            display: none;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity var(--transition-speed), transform var(--transition-speed);
        }

        .page.active {
            display: block;
            opacity: 1;
            transform: translateY(0);
        }
        
        /* 视频页面 */
        .video-container {
            position: relative;
            width: 100%;
            max-width: 800px;
            margin: 10px auto 20px auto; /* 调整外边距 */
            background-color: black;
            overflow: hidden;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .video-container.fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            max-width: none;
            z-index: 2000;
            border-radius: 0;
            margin:0; 
        }

        .video-player {
            width: 100%;
            height: auto;
            display: block;
        }

        .video-controls {
            display: flex;
            justify-content: space-between;
            align-items: center; 
            margin-top: 15px;
            padding: 0 10px;
            max-width: 800px; 
            margin-left: auto;  
            margin-right: auto; 
        }
        
        .video-ended-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
            opacity: 1;
            transition: opacity 0.5s;
        }

        .video-ended-overlay.fade-out {
            opacity: 0;
            pointer-events: none; 
        }

        .video-ended-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            max-width: 90%; /* 稍微增大宽度 */
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .video-ended-content h3 {
            margin-top: 0;
            color: var(--primary-color);
            font-size: 1.2rem; /* 调整字体大小 */
        }
         .video-ended-content p {
            font-size: 0.9rem; /* 调整字体大小 */
            margin-bottom: 15px;
        }


        .video-ended-buttons {
            display: flex;
            flex-direction: column; /* 在小屏幕上堆叠按钮 */
            gap: 10px;
            margin-top: 15px;
        }
         .video-ended-buttons .btn {
            width: 100%; /* 使按钮宽度充满容器 */
        }


        /* 答题页面 */
        .quiz-container {
            max-width: 800px;
            margin: 20px auto; 
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .quiz-header { text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
        .quiz-header h2 { font-size: 1.3rem; }
        .quiz-header p { font-size: 0.9rem; }
        .quiz-progress { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; font-size: 0.9rem;}
        .progress-bar-container { flex-grow: 1; height: 8px; background-color: #f0f0f0; border-radius: 4px; margin: 0 10px; overflow: hidden; }
        .progress-bar { height: 100%; background-color: var(--primary-color); width: 0%; transition: width 0.3s ease; }
        .question-container { margin-bottom: 30px; min-height: 150px;  }
        .question-title { font-size: 1.1rem; font-weight: bold; margin-bottom: 15px; color: var(--dark-color); }
        .question-type { display: inline-block; padding: 3px 8px; background-color: #f0f0f0; border-radius: 4px; font-size: 0.8rem; margin-bottom: 10px; }
        .question-type.single { background-color: #e6f7ff; color: #0070c9; }
        .question-type.multiple { background-color: #fff7e6; color: #d46b08; }
        .question-type.boolean { background-color: #f6ffed; color: #52c41a; }
        .options-list { list-style: none; padding: 0; margin: 0; }
        .option-item { padding: 10px 12px; margin-bottom: 8px; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; font-size: 0.9rem;}
        .option-item:hover { background-color: #f9f9f9; border-color: #ccc; }
        .option-item.selected { background-color: #e6f7ff; border-color: var(--primary-color); }
        .option-item.correct { background-color: #f6ffed !important; border-color: #52c41a !important; } 
        .option-item.incorrect { background-color: #fff1f0 !important; border-color: #ff4d4f !important; } 
        .option-marker { width: 22px; height: 22px; border-radius: 50%; background-color: #f0f0f0; color: var(--dark-color); display: flex; justify-content: center; align-items: center; margin-right: 10px; font-weight: bold; flex-shrink: 0; font-size: 0.85rem;}
        .option-text { flex-grow: 1; }
        .option-item.selected .option-marker { background-color: var(--primary-color); color: white; }
        .option-item.correct .option-marker { background-color: #52c41a; color: white; }
        .option-item.incorrect .option-marker { background-color: #ff4d4f; color: white; }
        .feedback-container { padding: 15px; border-radius: 6px; margin-top: 20px; display: none; font-size: 0.9rem;}
        .feedback-container.correct { background-color: #f6ffed; border: 1px solid #b7eb8f; }
        .feedback-container.incorrect { background-color: #fff1f0; border: 1px solid #ffa39e; }
        .feedback-title { font-weight: bold; margin-bottom: 8px; }
        .feedback-container.correct .feedback-title { color: #52c41a; }
        .feedback-container.incorrect .feedback-title { color: #ff4d4f; }
        .explanation { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ddd; }
        .quiz-actions { display: flex; justify-content: space-between; margin-top: 30px; }
        .quiz-result { text-align: center; padding: 30px 20px; }
        .result-score { font-size: 2.5rem; font-weight: bold; color: var(--primary-color); margin-bottom: 10px; }
        .result-message { font-size: 1.1rem; margin-bottom: 20px; }
        .result-details { display: flex; justify-content: center; gap: 20px; margin-bottom: 30px; flex-wrap: wrap;}
        .result-detail-item { text-align: center; }
        .detail-value { font-size: 1.3rem; font-weight: bold; color: var(--dark-color); }
        .detail-label { font-size: 0.85rem; color: #666; }
        .result-actions { display: flex; justify-content: center; gap: 15px; margin-top: 20px; flex-direction: column; }
         .result-actions .btn { width: 100%;}
        .perfect-score-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.8); display: none; justify-content: center; align-items: center; z-index: 2000; opacity: 0; pointer-events: none; transition: opacity 0.5s; padding: 15px;}
        .perfect-score-container.active { display: flex; opacity: 1; pointer-events: auto; }
        .perfect-score-content { text-align: center; color: white; max-width: 90%; }
        .perfect-score-title { font-size: 2rem; margin-bottom: 20px; color: #ffeb3b; animation: bounce-in 0.8s ease-out forwards; }
        .perfect-score-message { font-size: 1rem; margin-bottom: 30px; animation: fade-in-up 0.8s ease-out 0.3s forwards; opacity:0; }
        .perfect-score-actions { margin-top: 30px; animation: fade-in-up 0.8s ease-out 0.6s forwards; opacity:0; }
        
        /* 管理页面 */
        .admin-container { max-width: 1000px; margin: 20px auto; background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .admin-login { max-width: 400px; margin: 40px auto; padding: 30px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: bold; color: #555; }
        .form-group input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; transition: border-color 0.2s; }
        .form-group input:focus { border-color: var(--primary-color); outline: none; box-shadow: 0 0 0 2px rgba(0, 86, 179, 0.2); }
        .admin-panel { display: flex; min-height: 500px; border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
        .admin-sidebar { width: 220px; background-color: #f8f9fa; border-right: 1px solid #eee; padding: 20px 0; }
        .admin-menu { list-style: none; padding: 0; margin: 0; }
        .admin-menu li { margin-bottom: 0; }
        .admin-menu a { display: block; padding: 12px 20px; color: var(--dark-color); text-decoration: none; border-left: 4px solid transparent; transition: all 0.2s; font-size: 0.95rem; }
        .admin-menu a:hover { background-color: #e9ecef; color: var(--primary-color); }
        .admin-menu a.active { background-color: #e0eaf3; border-left-color: var(--primary-color); color: var(--primary-color); font-weight: bold; }
        .admin-content { flex: 1; padding: 25px; background-color: #fff; }
        .admin-content h2 { margin-bottom: 20px; color: var(--primary-color); border-bottom: 1px solid #eee; padding-bottom: 10px; font-size: 1.4rem; }
        .dashboard-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px; } /* Reduced gap */
        .stat-card { background-color: #f9f9f9; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 3px 8px rgba(0,0,0,0.08); }
        .stat-card h3 { font-size: 1rem; color: #555; margin-bottom: 8px; }
        .stat-value { font-size: 1.8rem; font-weight: bold; color: var(--primary-color); margin: 8px 0; }
        .tab-buttons { margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap; }
        .chart-placeholder { min-height: 250px; background-color: #f9f9f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; border: 1px solid #eee; padding: 15px; font-size: 0.9rem; }
        .video-item { margin-bottom: 25px; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #eee; }
        .video-item h3 { margin-top:0; margin-bottom: 10px; color: var(--dark-color); font-size: 1.1rem; }
        .video-item input { width: 100%; margin: 10px 0; padding: 8px; border: 1px solid #ddd; border-radius: 4px; } /* Full width on mobile */
        .video-item .btn { margin-left: 0; margin-top: 10px; display: block; width:100%;} /* Stack button on mobile */
        .question-table table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        .question-table th, .question-table td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
        .question-table th { background-color: #f5f5f5; font-weight: bold; }
        .question-table .btn-sm { padding: 4px 8px; font-size: 0.8rem; }
        
        /* 页脚 */
        .footer { background-color: var(--dark-color); color: white; padding: 20px 0; text-align: center; font-size: 0.9rem; margin-top:30px; }
        
        /* 加载指示器 */
        .loading-indicator { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 3px; background-color: var(--loading-color); z-index: 3000; opacity: 0; transition: opacity 0.3s, width 0.3s; }
        .loading-indicator.active { display: block; opacity: 1; animation: loading-progress 2s ease-in-out infinite; }
        @keyframes loading-progress { 0% { width: 0%; } 50% { width: 70%; } 100% { width: 100%; } }

        /* 按钮样式 */
        .btn { display: inline-block; padding: 10px 18px; background-color: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.95rem; transition: background-color 0.2s, transform 0.1s; text-align: center; text-decoration: none; margin: 5px; }
        .btn:hover { background-color: #004494; }
        .btn:active { transform: scale(0.98); }
        .btn-secondary { background-color: var(--secondary-color); }
        .btn-secondary:hover { background-color: #218838; }
        .btn-danger { background-color: var(--danger-color); }
        .btn-danger:hover { background-color: #c82333; }
        .btn-disabled, .btn[disabled] { opacity: 0.6; cursor: not-allowed; background-color: #ccc !important; }
        .btn-disabled:hover, .btn[disabled]:hover { background-color: #ccc !important; transform: none; }
        
        /* 确认模态框 */
        #confirmation-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); z-index: 3000; justify-content: center; align-items: center; padding: 15px; }
        #confirmation-modal > div { background: white; padding: 25px; border-radius: 8px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.3); max-width: 400px; width:100%; }
        #modal-message { margin-bottom: 20px; font-size: 1.1rem; color: #333; }
        #confirmation-modal .btn { margin: 0 8px; }

        /* 响应式设计 */
        @media (max-width: 768px) {
            .nav-title { font-size: 1rem; margin-right: 10px; /* Add some space if title is long */ }
            .nav-links { gap: 5px; /* Further reduce gap */ }
            .nav-link { padding: 5px 6px; font-size: 0.8rem; /* Further adjust */ }
            .page-container { margin-top: 60px; } /* Adjust if navbar height changes */
             .page > h1 { font-size: 1.1rem; margin-bottom: 10px;}
            .btn { padding: 8px 12px; font-size: 0.9rem; }
            .admin-panel { flex-direction: column; }
            .admin-sidebar { width: 100%; border-right: none; border-bottom: 1px solid #eee; border-radius: 8px 8px 0 0; }
            .admin-menu { display: flex; flex-wrap: wrap; justify-content: center;} /* Allow menu items to wrap */
            .admin-menu a { border-left: none; border-bottom: 3px solid transparent; text-align: center; padding: 10px 12px; font-size: 0.9rem;}
            .admin-menu a.active { border-bottom-color: var(--primary-color); border-left-color:transparent; }
            .admin-content { border-left: none; border-radius: 0 0 8px 8px; padding: 15px;}
            .dashboard-stats { grid-template-columns: 1fr; } 
            .video-item input { width: 100%; margin: 10px 0; }
            .video-item .btn { display: block; width: 100%; margin-top: 10px; margin-left:0; }
        }
        @media (max-width: 480px) {
            .nav-links {
                /* On very small screens, consider making nav links stack or use a hamburger menu */
                /* For now, just allow scrolling if they overflow */
            }
            .nav-link { font-size: 0.75rem; padding: 5px; }
            .page > h1 { font-size: 1rem; }
            .video-controls { flex-direction: column; gap:10px; }
            .video-controls .btn { width:100%; }
            .quiz-actions { flex-direction: column; gap:10px; }
            .quiz-actions .btn { width:100%; }
            .result-actions { flex-direction: column; gap:10px; }
            .result-actions .btn { width:100%; }
            .video-ended-content h3 { font-size: 1.1rem; }
            .video-ended-content p { font-size: 0.85rem; }
            .perfect-score-title { font-size: 1.8rem; }
            .perfect-score-message { font-size: 0.9rem; }
            .admin-content h2 {font-size: 1.2rem;}
            .stat-value {font-size: 1.6rem;}
            .stat-card h3 {font-size: 0.9rem;}

        }

        /* 动画 */
        @keyframes bounce-in { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.1); } 70% { transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .loading-message p { padding: 20px; text-align: center; color: #777; }
        .error-message p { padding: 20px; text-align: center; color: var(--danger-color); }
    </style>
</head>

<body>
    <div id="loading-indicator" class="loading-indicator"></div>

    <div id="confirmation-modal">
      <div>
        <p id="modal-message">您确定要执行此操作吗？</p>
        <button id="modal-confirm-btn" class="btn btn-danger">确定</button>
        <button id="modal-cancel-btn" class="btn">取消</button>
      </div>
    </div>

    <nav class="nav-container">
        <div class="container nav-content">
            <div class="nav-title">安全管理交互学习平台</div>
            <div class="nav-links">
                <a href="#video1" class="nav-link" data-page="video1">安全操作视频</a>
                <a href="#video2" class="nav-link" data-page="video2">违规操作视频</a>
                <a href="#quiz1" class="nav-link" data-page="quiz1">安全意识测试</a>
                <a href="#quiz2" class="nav-link" data-page="quiz2">违规操作测试</a>
                <a href="#admin" class="nav-link" data-page="admin">管理页面</a>
            </div>
        </div>
    </nav>

    <main class="page-container">
        <div class="container">
            <section id="video1" class="page" data-page-id="video1">
                <h1>你的选择决定安全分界-遵守规章制度-安全</h1>
                <div class="video-container">
                    <video id="video-player-1" class="video-player" controls autoplay muted playsinline></video>
                </div>
                <div class="video-controls">
                    <button id="fullscreen-btn-1" class="btn">全屏观看</button>
                    <button id="next-video-btn-1" class="btn" disabled>完成观看，前往测试</button>
                </div>
            </section>

            <section id="video2" class="page" data-page-id="video2">
                <h1>你的选择决定安全分界-违规操作-不安全</h1>
                <div class="video-container">
                    <video id="video-player-2" class="video-player" controls autoplay muted playsinline></video>
                </div>
                <div class="video-controls">
                    <button id="fullscreen-btn-2" class="btn">全屏观看</button>
                    <button id="next-video-btn-2" class="btn" disabled>完成观看，前往测试</button>
                </div>
            </section>

            <section id="quiz1" class="page" data-page-id="quiz1">
                <h1>测测你的主动安全意识有多强-按章操作</h1>
                <div class="quiz-container">
                    <div id="quiz-content-1">
                        <div class="quiz-header">
                            <h2>主动安全意识测试</h2>
                            <p>本测试共<span id="total-questions-header-1">10</span>道题目，测试您对安全操作规范的理解和掌握程度。</p>
                        </div>
                        <div class="quiz-progress">
                            <span class="progress-text">题目 <span id="current-question-1">0</span>/<span id="total-questions-1">10</span></span>
                            <div class="progress-bar-container"><div id="progress-bar-1" class="progress-bar"></div></div>
                            <span class="progress-percent" id="progress-percent-1">0%</span>
                        </div>
                        <div id="question-container-1" class="question-container"><div class="loading-message"><p>正在加载题目...</p></div></div>
                        <div id="feedback-container-1" class="feedback-container">
                            <div class="feedback-title"></div>
                            <div class="feedback-content"></div>
                            <div class="explanation"></div>
                        </div>
                        <div class="quiz-actions">
                            <button id="submit-btn-1" class="btn">提交答案</button>
                            <button id="next-quiz-btn-1" class="btn" style="display: none;">下一题</button>
                        </div>
                        <div id="quiz-result-1" class="quiz-result" style="display: none;">
                            <h2>测试结果</h2>
                            <div class="result-score">0</div>
                            <div class="result-message">您已完成主动安全意识测试</div>
                            <div class="result-details">
                                <div class="result-detail-item"><div class="detail-value" id="correct-count-1">0</div><div class="detail-label">正确题数</div></div>
                                <div class="result-detail-item"><div class="detail-value" id="incorrect-count-1">0</div><div class="detail-label">错误题数</div></div>
                                <div class="result-detail-item"><div class="detail-value" id="time-spent-1">0:00</div><div class="detail-label">用时</div></div>
                            </div>
                            <div class="result-actions">
                                <button id="retry-btn-1" class="btn">重新测试</button>
                                <button id="review-btn-1" class="btn btn-secondary">查看错题</button>
                                <button id="return-home-btn-1" class="btn">返回首页</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="perfect-score-1" class="perfect-score-container">
                    <div class="perfect-score-content">
                        <div class="perfect-score-title">恭喜您获得满分！</div>
                        <div class="perfect-score-message">您已完全掌握主动安全操作知识，继续保持这种安全意识，确保工作安全！</div>
                        <div class="perfect-score-actions"><button id="perfect-close-btn-1" class="btn">关闭</button></div>
                    </div>
                </div>
            </section>

            <section id="quiz2" class="page" data-page-id="quiz2">
                 <h1>测测你的主动安全意识有多强-违规操作</h1>
                <div class="quiz-container">
                    <div id="quiz-content-2">
                        <div class="quiz-header">
                            <h2>违规操作识别测试</h2>
                            <p>本测试共<span id="total-questions-header-2">10</span>道题目，测试您对违规操作的识别和规避能力。</p>
                        </div>
                        <div class="quiz-progress">
                            <span class="progress-text">题目 <span id="current-question-2">0</span>/<span id="total-questions-2">10</span></span>
                            <div class="progress-bar-container"><div id="progress-bar-2" class="progress-bar"></div></div>
                            <span class="progress-percent" id="progress-percent-2">0%</span>
                        </div>
                        <div id="question-container-2" class="question-container"><div class="loading-message"><p>正在加载题目...</p></div></div>
                        <div id="feedback-container-2" class="feedback-container">
                            <div class="feedback-title"></div>
                            <div class="feedback-content"></div>
                            <div class="explanation"></div>
                        </div>
                        <div class="quiz-actions">
                            <button id="submit-btn-2" class="btn">提交答案</button>
                            <button id="next-quiz-btn-2" class="btn" style="display: none;">下一题</button>
                        </div>
                        <div id="quiz-result-2" class="quiz-result" style="display: none;">
                            <h2>测试结果</h2>
                            <div class="result-score">0</div>
                            <div class="result-message">您已完成违规操作识别测试</div>
                            <div class="result-details">
                                <div class="result-detail-item"><div class="detail-value" id="correct-count-2">0</div><div class="detail-label">正确题数</div></div>
                                <div class="result-detail-item"><div class="detail-value" id="incorrect-count-2">0</div><div class="detail-label">错误题数</div></div>
                                <div class="result-detail-item"><div class="detail-value" id="time-spent-2">0:00</div><div class="detail-label">用时</div></div>
                            </div>
                            <div class="result-actions">
                                <button id="retry-btn-2" class="btn">重新测试</button>
                                <button id="review-btn-2" class="btn btn-secondary">查看错题</button>
                                <button id="return-home-btn-2" class="btn">返回首页</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="perfect-score-2" class="perfect-score-container">
                    <div class="perfect-score-content">
                        <div class="perfect-score-title">恭喜您获得满分！</div>
                        <div class="perfect-score-message">您已完全掌握违规操作识别知识，能够有效规避安全风险！</div>
                        <div class="perfect-score-actions"><button id="perfect-close-btn-2" class="btn">关闭</button></div>
                    </div>
                </div>
            </section>

            <section id="admin" class="page" data-page-id="admin">
                <h1>安全管理系统 - 管理页面</h1>
                <div class="admin-container">
                    <div class="admin-login" id="admin-login-form">
                        <h2>管理员登录</h2>
                        <div id="login-message" style="color:red; margin-bottom:10px;"></div>
                        <div class="form-group">
                            <label for="username">用户名</label>
                            <input type="text" id="username" name="username" placeholder="请输入用户名">
                        </div>
                        <div class="form-group">
                            <label for="password">密码</label>
                            <input type="password" id="password" name="password" placeholder="请输入密码">
                        </div>
                        <button id="login-btn" class="btn">登录</button>
                    </div>

                    <div class="admin-panel" id="admin-panel" style="display: none;">
                        <div class="admin-sidebar">
                            <ul class="admin-menu">
                                <li><a href="#" data-tab="dashboard" class="active">仪表盘</a></li>
                                <li><a href="#" data-tab="questions">题库管理</a></li>
                                <li><a href="#" data-tab="videos">视频管理</a></li>
                                <li><a href="#" data-tab="stats">数据统计</a></li>
                                <li><a href="#" id="admin-logout-btn">退出登录</a></li>
                            </ul>
                        </div>

                        <div class="admin-content">
                            <div class="admin-tab" id="dashboard-tab">
                                <h2>仪表盘概览</h2>
                                <div id="dashboard-message" style="margin-bottom:15px;"></div>
                                <button id="clear-dashboard-btn" class="btn btn-danger" style="margin-bottom: 20px;">清空仪表盘数据</button>
                                <div class="dashboard-stats">
                                    <div class="stat-card"><h3>总访问次数</h3><p class="stat-value" id="db-visit-count">0</p></div>
                                    <div class="stat-card"><h3>视频1观看次数</h3><p class="stat-value" id="db-video1-views">0</p></div>
                                    <div class="stat-card"><h3>视频2观看次数</h3><p class="stat-value" id="db-video2-views">0</p></div>
                                    <div class="stat-card"><h3>测试1平均分</h3><p class="stat-value" id="db-quiz1-avg-score">0</p></div>
                                    <div class="stat-card"><h3>测试2平均分</h3><p class="stat-value" id="db-quiz2-avg-score">0</p></div>
                                    <div class="stat-card"><h3>测试1完成次数</h3><p class="stat-value" id="db-quiz1-completions">0</p></div>
                                    <div class="stat-card"><h3>测试2完成次数</h3><p class="stat-value" id="db-quiz2-completions">0</p></div>
                                </div>
                            </div>

                            <div class="admin-tab" id="questions-tab" style="display: none;">
                                <h2>题库管理</h2>
                                <div id="questions-message" style="margin-bottom:15px;"></div>
                                <div class="tab-buttons">
                                    <button class="btn" data-question-type="active_safety">主动安全题库</button>
                                    <button class="btn" data-question-type="unauthorized">违规操作题库</button>
                                </div>
                                <div class="question-list"><p>请选择一个题库类型查看题目。</p></div>
                            </div>

                            <div class="admin-tab" id="videos-tab" style="display: none;">
                                <h2>视频管理</h2>
                                <div id="videos-message" style="margin-bottom:15px;"></div>
                                <div class="video-management">
                                    <div class="video-item">
                                        <h3>安全操作视频 (video1)</h3>
                                        <input type="text" id="video1-url" placeholder="视频URL">
                                        <button class="btn" data-video-id="video1">更新链接</button>
                                        </div>
                                    <div class="video-item">
                                        <h3>违规操作视频 (video2)</h3>
                                        <input type="text" id="video2-url" placeholder="视频URL">
                                        <button class="btn" data-video-id="video2">更新链接</button>
                                        </div>
                                </div>
                            </div>

                            <div class="admin-tab" id="stats-tab" style="display: none;">
                                <h2>数据统计</h2>
                                <div id="stats-message" style="margin-bottom:15px;"></div>
                                <button id="clear-stats-btn" class="btn btn-danger" style="margin-bottom: 20px;">清空所有统计数据</button>
                                <div class="stats-container">
                                    <div class="stats-chart">
                                        <h3>访问趋势 (按日期)</h3>
                                        <div id="visits-bydate-chart" class="chart-placeholder"><p>图表加载中...</p></div>
                                    </div>
                                    <div class="stats-chart">
                                        <h3>设备分布</h3>
                                        <div id="devices-chart" class="chart-placeholder"><p>图表加载中...</p></div>
                                    </div>
                                </div>
                            </div>
                            
                            <!--
                            <div class="admin-tab" id="settings-tab" style="display: none;">
                                <h2>系统设置</h2>
                                <p>系统设置功能待开发。</p>
                            </div>
                            -->
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>© ${new Date().getFullYear()} 安全管理交互学习平台 - 版权所有</p>
        </div>
    </footer>

    <script>
        // 全局应用状态
        const appState = {
            isLoading: false,
            currentPage: null,
            userSession: { /* ... */ }, 
            quizProgress: { /* ... */ }, 
            videoProgress: { /* ... */ },
            adminAuth: {
                authenticated: false,
                username: null,
                displayName: null,
                permissions: [],
                token: null
            },
            cache: {
                questions: { active_safety: null, unauthorized: null, lastFetched: null },
                videoUrls: { video1: null, video2: null, lastFetched: null }
            }
        };

        document.addEventListener('DOMContentLoaded', function () {
            initApp();
        });

        function initApp() {
            initLoadingIndicator();
            initUserSession(); 
            initRouter();      
            initGlobalInteractiveEffects();
            console.log('应用初始化完成');
        }

        function initRouter() {
            const hash = window.location.hash.substring(1) || 'video1';
            window.addEventListener('popstate', function (event) {
                const pageId = event.state ? event.state.pageId : (window.location.hash.substring(1) || 'video1');
                navigateTo(pageId, {}, false);
            });
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    const pageId = this.getAttribute('data-page');
                    navigateTo(pageId);
                });
            });
            navigateTo(hash, {}, false); 
            console.log('路由系统初始化完成');
        }
        
        function showConfirmationModal(message, onConfirm) {
            const modal = document.getElementById('confirmation-modal');
            document.getElementById('modal-message').textContent = message;
            modal.style.display = 'flex';

            const confirmBtn = document.getElementById('modal-confirm-btn');
            const cancelBtn = document.getElementById('modal-cancel-btn');
            
            const newConfirmBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
            
            const newCancelBtn = cancelBtn.cloneNode(true);
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

            newConfirmBtn.onclick = () => {
                modal.style.display = 'none';
                if (typeof onConfirm === 'function') onConfirm();
            };
            newCancelBtn.onclick = () => {
                modal.style.display = 'none';
            };
        }
        
        function showUIMessage(elementId, message, type = 'info') {
            const el = document.getElementById(elementId);
            if (el) {
                el.textContent = message;
                el.style.color = type === 'error' ? 'red' : (type === 'success' ? 'green' : 'blue');
                el.style.display = 'block';
                setTimeout(() => { el.style.display = 'none'; el.textContent = ''; }, 5000); 
            }
        }

        function navigateTo(pageId, params = {}, pushToHistory = true) {
            if (appState.showLoading) appState.showLoading();

            const targetPage = document.querySelector(\`.page[data-page-id="\${pageId}"]\`);
            if (!targetPage) {
                console.error(\`页面 "\${pageId}" 不存在，导航到默认页面 video1\`);
                if (appState.hideLoading) appState.hideLoading();
                navigateTo('video1'); 
                return false;
            }

            const currentPageEl = document.querySelector('.page.active');
            if (currentPageEl && currentPageEl.getAttribute('data-page-id') === pageId) {
                if (appState.hideLoading) appState.hideLoading();
                // If it's the same page, but params are different, re-init content
                if (JSON.stringify(params) !== JSON.stringify(appState.currentPageParams || {})) {
                     initPageContent(pageId, params);
                }
                return true; 
            }
            
            if (currentPageEl) {
                currentPageEl.classList.remove('active');
            }
            targetPage.classList.add('active');
            appState.currentPage = pageId;
            appState.currentPageParams = params;


            if (pushToHistory) {
                window.history.pushState({ pageId, params }, '', \`#\${pageId}\`);
            }
            
            updateNavHighlight(pageId);
            initPageContent(pageId, params); 
            window.scrollTo(0, 0); 

            if (appState.hideLoading) appState.hideLoading();
            console.log(\`导航到页面: \${pageId}\`);
            return true;
        }

        function updateNavHighlight(pageId) {
            document.querySelectorAll('.nav-link').forEach(link => {
                if (link.getAttribute('data-page') === pageId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }

        function initPageContent(pageId, params) {
            if (pageId.startsWith('video')) {
                initVideoPage(pageId);
            } else if (pageId.startsWith('quiz')) {
                initQuizPage(pageId);
            } else if (pageId === 'admin') {
                initAdminPage(params);
            }
        }
        
        async function sendToServer(endpoint, options = {}) {
            const defaultHeaders = {
                'Content-Type': 'application/json',
            };
            if (appState.adminAuth.token) {
                defaultHeaders['Authorization'] = \`Bearer \${appState.adminAuth.token}\`;
            }
            // Removed Basic Auth fallback from here to rely solely on token for authenticated routes
            // Basic Auth is primarily for initial /admin access if directly navigated.

            const config = {
                ...options,
                headers: {
                    ...defaultHeaders,
                    ...(options.headers || {}),
                },
            };

            if (options.body && typeof options.body !== 'string') {
                config.body = JSON.stringify(options.body);
            }
            
            const fullUrl = new URL(endpoint, window.location.origin).toString();
            console.log(\`[API Call] \${config.method || 'GET'} \${fullUrl}\`, config.body ? JSON.parse(config.body) : '');


            try {
                if (appState.showLoading) appState.showLoading();
                const response = await fetch(fullUrl, config);
                if (appState.hideLoading) appState.hideLoading();

                if (!response.ok) {
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (e) {
                        errorData = { error: await response.text() || response.statusText };
                    }
                    console.error(\`API请求失败 (\${response.status}): \${endpoint}\`, errorData);
                    // Handle token expiration or invalid token specifically for admin actions
                    if ((response.status === 401) && endpoint.startsWith('/api/')) {
                         if (appState.currentPage === 'admin' && pageId !== 'admin') { // Check if current page is admin
                            showUIMessage('login-message', '会话已过期或无效，请重新登录。', 'error');
                            // Potentially redirect to login or show login form
                            const loginForm = document.getElementById('admin-login-form');
                            const adminPanel = document.getElementById('admin-panel');
                            if(loginForm) loginForm.style.display = 'block';
                            if(adminPanel) adminPanel.style.display = 'none';
                            localStorage.removeItem('admin_auth_token');
                            appState.adminAuth = { authenticated: false, token: null };
                         }
                    }
                    return { success: false, status: response.status, ...errorData };
                }
                if (response.status === 204 || response.headers.get("content-length") === "0") {
                    return { success: true, status: response.status, data: null };
                }
                const result = await response.json();
                console.log(\`[API Response] \${endpoint}\`, result);
                return result; 
            } catch (error) {
                if (appState.hideLoading) appState.hideLoading();
                console.error('网络请求错误:', endpoint, error);
                return { success: false, error: '网络错误，请稍后再试。', details: error.message };
            }
        }

        function initAdminPage(params = {}) {
            console.log('初始化管理页面');
            const loginForm = document.getElementById('admin-login-form');
            const adminPanel = document.getElementById('admin-panel');
            const loginBtn = document.getElementById('login-btn');
            const loginMessageEl = document.getElementById('login-message');
            const adminLogoutBtn = document.getElementById('admin-logout-btn');

            function showLoginForm() {
                loginForm.style.display = 'block';
                adminPanel.style.display = 'none';
                appState.adminAuth = { authenticated: false, token: null, username: null }; 
                localStorage.removeItem('admin_auth_token'); 
            }

            function showAdminPanel() {
                loginForm.style.display = 'none';
                adminPanel.style.display = 'flex';
                loadAdminData(); 
                switchAdminTab('dashboard');
            }
            
            const storedToken = localStorage.getItem('admin_auth_token');
            if (storedToken) {
                appState.adminAuth.token = storedToken;
                // Simple check: if token exists, assume valid for now and try to show panel.
                // API calls will fail if token is actually invalid/expired, handled by sendToServer.
                console.log("检测到已存储的管理员token, 尝试进入管理面板。");
                showAdminPanel();
            } else {
                 showLoginForm();
            }

            if (loginBtn) {
                loginBtn.onclick = async function () { 
                    const username = document.getElementById('username').value;
                    const password = document.getElementById('password').value; // Password not stored long-term
                    loginMessageEl.textContent = '';

                    if (!username || !password) {
                        loginMessageEl.textContent = '请输入用户名和密码';
                        return;
                    }
                    
                    const response = await sendToServer('/api/admin/login', {
                        method: 'POST',
                        body: { username, password }
                    });

                    if (response && response.success && response.token) {
                        appState.adminAuth = {
                            authenticated: true,
                            username: response.username,
                            displayName: response.displayName,
                            permissions: response.permissions,
                            token: response.token,
                        };
                        localStorage.setItem('admin_auth_token', response.token); 
                        showAdminPanel();
                    } else {
                        loginMessageEl.textContent = response.error || '登录失败，请检查凭据。';
                        appState.adminAuth = { authenticated: false, token: null, username: null }; 
                    }
                };
            }
            
            if(adminLogoutBtn) {
                adminLogoutBtn.onclick = function(e) {
                    e.preventDefault();
                    showConfirmationModal("您确定要退出登录吗？", () => {
                        showLoginForm();
                        const adminNavLink = document.querySelector('.nav-link[data-page="admin"]');
                        if (adminNavLink) adminNavLink.classList.remove('active');
                        console.log("管理员已退出登录");
                    });
                }
            }

            document.querySelectorAll('.admin-menu a[data-tab]').forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    const tabId = this.getAttribute('data-tab');
                    switchAdminTab(tabId);
                });
            });
        }

        function switchAdminTab(tabId) {
            document.querySelectorAll('.admin-menu a').forEach(item => item.classList.remove('active'));
            document.querySelectorAll('.admin-tab').forEach(tab => tab.style.display = 'none');
            
            const activeLink = document.querySelector(\`.admin-menu a[data-tab="\${tabId}"]\`);
            if(activeLink) activeLink.classList.add('active');
            
            const activeTab = document.getElementById(\`\${tabId}-tab\`);
            if(activeTab) activeTab.style.display = 'block';

            if (tabId === 'dashboard') loadDashboardData();
            if (tabId === 'questions') loadQuestionBanks();
            if (tabId === 'videos') loadVideoDataForAdmin();
            if (tabId === 'stats') loadStatsDataForAdmin();
        }

        async function loadAdminData() {
            if (!appState.adminAuth.token) { // Check for token instead of authenticated flag for initial load
                console.warn("管理员未认证或token丢失，无法加载管理数据。");
                const loginForm = document.getElementById('admin-login-form');
                const adminPanel = document.getElementById('admin-panel');
                if(loginForm) loginForm.style.display = 'block';
                if(adminPanel) adminPanel.style.display = 'none';
                return;
            }
            loadDashboardData();
        }

        async function loadDashboardData() {
            const response = await sendToServer('/api/stats', { method: 'GET' });
            const msgEl = document.getElementById('dashboard-message');

            if (response && response.success && response.stats) {
                const stats = response.stats;
                document.getElementById('db-visit-count').textContent = stats.visits.total || 0;
                document.getElementById('db-video1-views').textContent = stats.videoStats.video1?.views || 0;
                document.getElementById('db-video2-views').textContent = stats.videoStats.video2?.views || 0;
                document.getElementById('db-quiz1-avg-score').textContent = Math.round(stats.quizStats.quiz1?.averageScore || 0);
                document.getElementById('db-quiz2-avg-score').textContent = Math.round(stats.quizStats.quiz2?.averageScore || 0);
                document.getElementById('db-quiz1-completions').textContent = stats.quizStats.quiz1?.completions || 0;
                document.getElementById('db-quiz2-completions').textContent = stats.quizStats.quiz2?.completions || 0;
                if(msgEl) msgEl.textContent = '';
            } else {
                console.error('加载仪表盘数据失败:', response?.error);
                if(msgEl) showUIMessage('dashboard-message', \`加载仪表盘数据失败: \${response?.error || '未知错误'}\`, 'error');
            }
        }
        
        async function loadQuestionBanks() {
            const questionListContainer = document.querySelector('#questions-tab .question-list');
            const msgEl = document.getElementById('questions-message');
            if (!questionListContainer) return;
            
            questionListContainer.innerHTML = '<p>题库加载中...</p>';
            if(msgEl) msgEl.textContent = '';

            const activeSafetyBtn = document.querySelector('#questions-tab .tab-buttons button[data-question-type="active_safety"]');
            const unauthorizedBtn = document.querySelector('#questions-tab .tab-buttons button[data-question-type="unauthorized"]');

            async function fetchAndDisplayQuestions(type) {
                questionListContainer.innerHTML = '<p>正在加载题目...</p>';
                const response = await sendToServer(\`/api/questions?type=\${type}&count=100\`, { method: 'GET' }); 
                if (response && response.success && response.questions) {
                    appState.cache.questions[type] = response.questions;
                    updateQuestionBankUI(type, response.questions);
                } else {
                    questionListContainer.innerHTML = \`<p>加载\${type === 'active_safety' ? '主动安全' : '违规操作'}题库失败: \${response?.error || '未知错误'}</p>\`;
                    if(msgEl) showUIMessage('questions-message', \`加载题库失败: \${response?.error || '未知错误'}\`, 'error');
                }
            }
            
            if(activeSafetyBtn) activeSafetyBtn.onclick = () => fetchAndDisplayQuestions('active_safety');
            if(unauthorizedBtn) unauthorizedBtn.onclick = () => fetchAndDisplayQuestions('unauthorized');
            
            fetchAndDisplayQuestions('active_safety');
        }

        function updateQuestionBankUI(questionType, questions) {
            const questionListContainer = document.querySelector('#questions-tab .question-list');
            if (!questions || questions.length === 0) {
                questionListContainer.innerHTML = '<p>此题库暂无题目数据。</p>';
                return;
            }

            let html = '<div class="question-table"><table>';
            html += '<thead><tr><th>ID</th><th>题目</th><th>类型</th><th>难度</th><th>选项</th><th>正确答案</th><th>解释</th></tr></thead><tbody>';
            questions.forEach(q => {
                const typeText = { single: '单选', multiple: '多选', boolean: '判断' }[q.type] || q.type;
                const optionsText = q.options.map((opt, i) => \`\${String.fromCharCode(65 + i)}. \${opt}\`).join('<br>');
                let correctAnswerText = '';
                if (q.type === 'multiple') {
                    correctAnswerText = (Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer]).map(idx => String.fromCharCode(65 + idx)).join(', ');
                } else {
                    correctAnswerText = String.fromCharCode(65 + q.correctAnswer);
                }

                html += \`<tr>
                    <td>\${q.id || '-'}</td>
                    <td>\${q.question}</td>
                    <td>\${typeText}</td>
                    <td>\${q.difficulty || '普通'}</td>
                    <td>\${optionsText}</td>
                    <td>\${correctAnswerText}</td>
                    <td>\${q.explanation || '-'}</td>
                </tr>\`;
            });
            html += '</tbody></table></div>';
            questionListContainer.innerHTML = html;
        }
        
        async function loadVideoDataForAdmin() {
            const video1UrlInput = document.getElementById('video1-url');
            const video2UrlInput = document.getElementById('video2-url');
            const msgEl = document.getElementById('videos-message');
            if(msgEl) msgEl.textContent = '';

            async function fetchVideoUrl(videoId, inputElement) {
                const response = await sendToServer(\`/api/video?id=\${videoId}\`, { method: 'GET' });
                if (response && response.success && response.url) {
                    inputElement.value = response.url;
                } else {
                    inputElement.placeholder = \`加载\${videoId} URL失败\`;
                    if(msgEl) showUIMessage('videos-message', \`加载 \${videoId} URL失败: \${response?.error || '未知错误'}\`, 'error');
                }
            }

            if (video1UrlInput) fetchVideoUrl('video1', video1UrlInput);
            if (video2UrlInput) fetchVideoUrl('video2', video2UrlInput);

            document.querySelectorAll('#videos-tab .video-item .btn[data-video-id]').forEach(btn => {
                const newBtn = btn.cloneNode(true); // Clone to remove old listeners
                btn.parentNode.replaceChild(newBtn, btn);
                newBtn.addEventListener('click', async function() {
                    const videoId = this.getAttribute('data-video-id');
                    const urlInput = document.getElementById(\`\${videoId}-url\`);
                    if (!urlInput || !urlInput.value) {
                        if(msgEl) showUIMessage('videos-message', '请输入有效的视频URL', 'error');
                        return;
                    }
                    try { new URL(urlInput.value); } catch(e) { if(msgEl) showUIMessage('videos-message', '视频URL格式无效', 'error'); return; }

                    showConfirmationModal(\`确定要更新 \${videoId} 的链接为 "\${urlInput.value}" 吗？\`, async () => {
                        const updateResponse = await sendToServer('/api/video/update', {
                            method: 'POST',
                            body: { videoId, url: urlInput.value }
                        });
                        if (updateResponse && updateResponse.success) {
                           if(msgEl) showUIMessage('videos-message', \`\${videoId} URL更新成功！\`, 'success');
                        } else {
                           if(msgEl) showUIMessage('videos-message', \`\${videoId} URL更新失败: \${updateResponse?.error || '未知错误'}\`, 'error');
                        }
                    });
                });
            });
        }
        
        async function loadStatsDataForAdmin() {
            const visitsChartEl = document.getElementById('visits-bydate-chart');
            const devicesChartEl = document.getElementById('devices-chart');
            const msgEl = document.getElementById('stats-message');

            if(msgEl) msgEl.textContent = '';
            if(visitsChartEl) visitsChartEl.innerHTML = '<p>图表加载中...</p>';
            if(devicesChartEl) devicesChartEl.innerHTML = '<p>图表加载中...</p>';

            const response = await sendToServer('/api/stats', { method: 'GET' });
            if (response && response.success && response.stats) {
                const stats = response.stats;
                if(visitsChartEl) updateVisitsChartForAdmin(visitsChartEl, stats.visits.byDate);
                if(devicesChartEl) updateDevicesChartForAdmin(devicesChartEl, stats.visits.byDevice);
            } else {
                 if(visitsChartEl) visitsChartEl.innerHTML = '<p>加载访问趋势图表失败。</p>';
                 if(devicesChartEl) devicesChartEl.innerHTML = '<p>加载设备分布图表失败。</p>';
                 if(msgEl) showUIMessage('stats-message', \`加载统计图表失败: \${response?.error || '未知错误'}\`, 'error');
            }
        }

        function updateVisitsChartForAdmin(container, byDateData) {
            if (!byDateData || Object.keys(byDateData).length === 0) {
                container.innerHTML = '<p>暂无按日期访问数据。</p>'; return;
            }
            let html = '<div class="question-table"><table><thead><tr><th>日期</th><th>访问次数</th></tr></thead><tbody>'; // Reused question-table style
            const sortedDates = Object.keys(byDateData).sort((a,b) => new Date(b) - new Date(a)).slice(0,30); 
            sortedDates.forEach(date => { html += \`<tr><td>\${date}</td><td>\${byDateData[date]}</td></tr>\`; });
            html += '</tbody></table></div>';
            container.innerHTML = html;
        }

        function updateDevicesChartForAdmin(container, byDeviceData) {
            if (!byDeviceData || Object.keys(byDeviceData).length === 0) {
                container.innerHTML = '<p>暂无设备分布数据。</p>'; return;
            }
            let html = '<div class="question-table"><table><thead><tr><th>设备类型</th><th>访问次数</th></tr></thead><tbody>'; // Reused question-table style
            for (const device in byDeviceData) {
                html += \`<tr><td>\${device}</td><td>\${byDeviceData[device]}</td></tr>\`;
            }
            html += '</tbody></table></div>';
            container.innerHTML = html;
        }
        
        function setupClearStatsButtons() {
            const clearDashboardBtn = document.getElementById('clear-dashboard-btn');
            const clearStatsBtn = document.getElementById('clear-stats-btn');
            
            async function handleClearStats(messageElementId) {
                const response = await sendToServer('/api/stats/clear', { method: 'POST' });
                if (response && response.success) {
                    showUIMessage(messageElementId, '统计数据已成功清空！', 'success');
                    loadDashboardData(); 
                    if (document.getElementById('stats-tab').style.display === 'block') { 
                        loadStatsDataForAdmin();
                    }
                } else {
                    showUIMessage(messageElementId, \`清空统计数据失败: \${response?.error || '未知错误'}\`, 'error');
                }
            }

            if(clearDashboardBtn) {
                clearDashboardBtn.addEventListener('click', () => {
                    showConfirmationModal('您确定要清空所有仪表盘及统计数据吗？此操作不可恢复。', () => handleClearStats('dashboard-message'));
                });
            }
            if(clearStatsBtn) {
                clearStatsBtn.addEventListener('click', () => {
                    showConfirmationModal('您确定要清空所有统计数据吗？此操作不可恢复。', () => handleClearStats('stats-message'));
                });
            }
        }
        document.addEventListener('DOMContentLoaded', () => {
          if (document.getElementById('admin')) { 
            setTimeout(setupClearStatsButtons, 500); 
          }
        });

        async function initVideoPage(pageId) {
            console.log(\`初始化视频页面: \${pageId}\`);
            const videoNumber = pageId.slice(-1);
            const videoElement = document.getElementById(\`video-player-\${videoNumber}\`);
            const fullscreenBtn = document.getElementById(\`fullscreen-btn-\${videoNumber}\`);
            const nextBtn = document.getElementById(\`next-video-btn-\${videoNumber}\`); 

            if (!videoElement || !nextBtn) {
                console.error(\`视频页面 \${pageId} 元素未找到\`);
                return;
            }
            // 确保 videoProgress 结构存在
            if (!appState.videoProgress[pageId]) {
                appState.videoProgress[pageId] = { watched: false, progress: 0, lastPosition: 0, watchedAt: null, watchCount: 0 };
            }


            const videoUrl = await getVideoUrl(pageId); 
            if (videoUrl) {
                videoElement.src = videoUrl;
                // 尝试自动播放（静音）
                // videoElement.play().catch(e => console.warn("Autoplay was prevented:", e)); // Autoplay with mute is in HTML
            } else {
                console.error(\`未能加载视频URL for \${pageId}\`);
                videoElement.parentElement.innerHTML = "<p style='color:red; text-align:center; padding:20px;'>视频加载失败，请检查链接或稍后再试。</p>";
                return;
            }
            
            videoElement.onended = () => {
                appState.videoProgress[pageId].watched = true;
                nextBtn.disabled = false;
                nextBtn.classList.remove('btn-disabled');
                saveAppData();
                showVideoEndedUI(pageId);
            };
            
            if (appState.videoProgress[pageId] && appState.videoProgress[pageId].watched) {
                nextBtn.disabled = false;
                nextBtn.classList.remove('btn-disabled');
            } else {
                nextBtn.disabled = true;
                nextBtn.classList.add('btn-disabled');
            }

            if (fullscreenBtn) {
                fullscreenBtn.onclick = () => toggleFullscreen(videoElement.parentElement); 
            }
            if (nextBtn) {
                nextBtn.onclick = () => navigateTo(\`quiz\${videoNumber}\`);
            }
        }
        
        function toggleFullscreen(element) {
            if (!document.fullscreenElement) {
                if (element.requestFullscreen) {
                    element.requestFullscreen().catch(err => {
                        console.warn(\`全屏请求失败: \${err.message}\`);
                        // Fallback for iOS or if API fails, maybe a class to maximize?
                        element.classList.add('fullscreen-fallback'); 
                    });
                } else if (element.webkitRequestFullscreen) { /* Safari */
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) { /* IE11 */
                    element.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { /* Safari */
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE11 */
                    document.msExitFullscreen();
                }
                 element.classList.remove('fullscreen-fallback');
            }
        }
        // Add listener for fullscreen change to remove fallback class
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                const fallbackElement = document.querySelector('.fullscreen-fallback');
                if (fallbackElement) fallbackElement.classList.remove('fullscreen-fallback');
            }
        });

        
        function showVideoEndedUI(videoId) {
            const videoContainer = document.querySelector(\`#\${videoId} .video-container\`);
            if (!videoContainer) return;

            let endedOverlay = videoContainer.querySelector('.video-ended-overlay');
            if (!endedOverlay) {
                endedOverlay = document.createElement('div');
                endedOverlay.className = 'video-ended-overlay';
                videoContainer.appendChild(endedOverlay);
            }
            
            endedOverlay.innerHTML = \`
                <div class="video-ended-content">
                    <h3>视频观看完成</h3>
                    <p>您已完成本视频的学习，现在可以进行知识测试了。</p>
                    <div class="video-ended-buttons">
                        <button class="btn btn-replay">重新观看</button>
                        <button class="btn btn-next">前往测试</button>
                    </div>
                </div>
            \`;
            endedOverlay.classList.remove('fade-out'); 

            const videoNumber = videoId.slice(-1);
            const videoElement = document.getElementById(\`video-player-\${videoNumber}\`);

            endedOverlay.querySelector('.btn-replay').onclick = () => {
                endedOverlay.classList.add('fade-out');
                if(videoElement) { videoElement.currentTime = 0; videoElement.play(); }
            };
            endedOverlay.querySelector('.btn-next').onclick = () => {
                navigateTo(\`quiz\${videoNumber}\`);
            };
        }

        async function initQuizPage(pageId) {
            console.log(\`初始化答题页面: \${pageId}\`);
            const quizNumber = pageId.slice(-1);
             // Ensure quizProgress structure exists
            if (!appState.quizProgress[pageId]) {
                appState.quizProgress[pageId] = { currentQuestion: 0, questions: [], answers: [], correctCount: 0, score: 0, startedAt: null, completedAt: null, timeSpent: 0 };
            }
            const quizProgress = appState.quizProgress[pageId];


            if (quizProgress && quizProgress.completedAt) {
                showQuizResult(pageId);
                return;
            }
            if (quizProgress && quizProgress.questions && quizProgress.questions.length > 0 && quizProgress.currentQuestion < quizProgress.questions.length) {
                resumeQuiz(pageId);
                return;
            }
            await startNewQuiz(pageId);
        }

        async function startNewQuiz(quizId) {
            showQuizLoading(quizId, true);
            const quizNumber = quizId.slice(-1);
            const quizType = quizId === 'quiz1' ? 'active_safety' : 'unauthorized';
            const questions = await getRandomQuestions(quizType, { count: 10 });

            if (!questions || questions.length === 0) {
                document.getElementById(\`question-container-\${quizNumber}\`).innerHTML = \`<div class="error-message"><p>加载题目失败，请刷新页面重试。</p><button class="btn" onclick="location.reload()">刷新</button></div>\`;
                showQuizLoading(quizId, false);
                return;
            }

            appState.quizProgress[quizId] = {
                currentQuestion: 0,
                questions: questions,
                answers: [],
                correctCount: 0,
                score: 0,
                startedAt: Date.now(),
                completedAt: null,
                timeSpent: 0
            };
            saveAppData();
            document.getElementById(\`total-questions-header-\${quizNumber}\`).textContent = questions.length;
            document.getElementById(\`total-questions-\${quizNumber}\`).textContent = questions.length;
            
            // Ensure quiz content is visible and result is hidden
            document.getElementById(\`quiz-content-\${quizNumber}\`).style.display = 'block';
            document.getElementById(\`quiz-result-\${quizNumber}\`).style.display = 'none';
            document.getElementById(\`question-container-\${quizNumber}\`).style.display = 'block'; // Show question area
            document.querySelector(\`#quiz\${quizNumber} .quiz-actions\`).style.display = 'flex'; // Show actions

            renderQuestion(quizId, 0);
            bindQuizEvents(quizId); 
            startQuizTimer(quizId);
            showQuizLoading(quizId, false);
        }

        function resumeQuiz(quizId) {
            console.log(\`恢复答题: \${quizId}\`);
            const quizNumber = quizId.slice(-1);
            const quizProgress = appState.quizProgress[quizId];
            document.getElementById(\`total-questions-header-\${quizNumber}\`).textContent = quizProgress.questions.length;
            document.getElementById(\`total-questions-\${quizNumber}\`).textContent = quizProgress.questions.length;
            
            document.getElementById(\`quiz-content-\${quizNumber}\`).style.display = 'block';
            document.getElementById(\`quiz-result-\${quizNumber}\`).style.display = 'none';
            document.getElementById(\`question-container-\${quizNumber}\`).style.display = 'block';
            document.querySelector(\`#quiz\${quizNumber} .quiz-actions\`).style.display = 'flex';

            renderQuestion(quizId, quizProgress.currentQuestion);
            bindQuizEvents(quizId);
            updateQuizProgressUI(quizId);
            startQuizTimer(quizId); 
        }
        
        function renderQuestion(quizId, questionIndex) {
            const quizNumber = quizId.slice(-1);
            const quizProgress = appState.quizProgress[quizId];
            const question = quizProgress.questions[questionIndex];
            const questionContainer = document.getElementById(\`question-container-\${quizNumber}\`);

            if (!question) { console.error("题目未找到"); questionContainer.innerHTML = "<p class='error-message'>题目加载错误!</p>"; return; }

            const questionType = question.type || 'single';
            const typeText = { single: '单选题', multiple: '多选题', boolean: '判断题' }[questionType] || '单选题';
            
            let html = \`<div class="question-type \${questionType}">\${typeText}</div>
                        <div class="question-title">\${question.question}</div>
                        <ul class="options-list" data-question-type="\${questionType}">\`;
            question.options.forEach((option, index) => {
                const marker = String.fromCharCode(65 + index); 
                html += \`<li class="option-item" data-option-index="\${index}">
                            <div class="option-marker">\${marker}</div>
                            <div class="option-text">\${option}</div>
                         </li>\`;
            });
            html += \`</ul>\`;
            questionContainer.innerHTML = html;

            questionContainer.querySelectorAll('.option-item').forEach(item => {
                item.onclick = function() { 
                    const selectedIndex = parseInt(this.getAttribute('data-option-index'));
                    if (questionType === 'single' || questionType === 'boolean') {
                        questionContainer.querySelectorAll('.option-item').forEach(opt => opt.classList.remove('selected'));
                        this.classList.add('selected');
                    } else if (questionType === 'multiple') {
                        this.classList.toggle('selected');
                    }
                };
            });
            updateQuizProgressUI(quizId);
            resetFeedbackContainer(quizId);
            document.getElementById(\`submit-btn-\${quizNumber}\`).style.display = 'block';
            document.getElementById(\`next-quiz-btn-\${quizNumber}\`).style.display = 'none';
        }
        
        function handleAnswer(quizId) {
            const quizNumber = quizId.slice(-1);
            const quizProgress = appState.quizProgress[quizId];
            const question = quizProgress.questions[quizProgress.currentQuestion];
            const selectedItems = document.querySelectorAll(\`#question-container-\${quizNumber} .option-item.selected\`);
            const feedbackContainer = document.getElementById(\`feedback-container-\${quizNumber}\`);


            if (selectedItems.length === 0) {
                // Instead of alert, show message in feedback area or a dedicated message spot
                feedbackContainer.style.display = 'block';
                feedbackContainer.className = 'feedback-container incorrect'; // Style as an error/warning
                feedbackContainer.querySelector('.feedback-title').textContent = '提示';
                feedbackContainer.querySelector('.feedback-content').textContent = '请选择一个答案。';
                feedbackContainer.querySelector('.explanation').textContent = '';
                return;
            }

            let userAnswerIndices;
            if (question.type === 'multiple') {
                userAnswerIndices = Array.from(selectedItems).map(item => parseInt(item.getAttribute('data-option-index')));
            } else {
                userAnswerIndices = parseInt(selectedItems[0].getAttribute('data-option-index'));
            }

            let isCorrect = false;
            const correctAnswersArray = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
            if (question.type === 'multiple') {
                isCorrect = userAnswerIndices.length === correctAnswersArray.length && 
                            userAnswerIndices.every(idx => correctAnswersArray.includes(idx)) && 
                            correctAnswersArray.every(idx => userAnswerIndices.includes(idx));
            } else {
                isCorrect = userAnswerIndices === correctAnswersArray[0]; // correctAnswer is always an array now internally
            }

            quizProgress.answers[quizProgress.currentQuestion] = userAnswerIndices;
            if (isCorrect) quizProgress.correctCount++;
            
            showAnswerFeedback(quizId, isCorrect, question);
            highlightOptions(quizId, question, userAnswerIndices); 
            
            document.getElementById(\`submit-btn-\${quizNumber}\`).style.display = 'none';
            document.getElementById(\`next-quiz-btn-\${quizNumber}\`).style.display = 'block';
        }

        function highlightOptions(quizId, question, userAnswerIndices) { // Removed isCorrect, derive from question.correctAnswer
            const quizNumber = quizId.slice(-1);
            const optionItems = document.querySelectorAll(\`#question-container-\${quizNumber} .option-item\`);
            const correctAnswersArray = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
            const userAnswersArray = Array.isArray(userAnswerIndices) ? userAnswerIndices : [userAnswerIndices];
            
            optionItems.forEach((item, index) => {
                item.style.pointerEvents = 'none'; 
                
                if (correctAnswersArray.includes(index)) {
                    item.classList.add('correct');
                }
                
                if (userAnswersArray.includes(index) && !correctAnswersArray.includes(index)) {
                    item.classList.add('incorrect');
                }
            });
        }
        
        function showAnswerFeedback(quizId, isCorrect, question) {
            const quizNumber = quizId.slice(-1);
            const feedbackContainer = document.getElementById(\`feedback-container-\${quizNumber}\`);
            const feedbackTitle = feedbackContainer.querySelector('.feedback-title');
            const feedbackContent = feedbackContainer.querySelector('.feedback-content');
            const explanationEl = feedbackContainer.querySelector('.explanation');

            feedbackContainer.className = \`feedback-container \${isCorrect ? 'correct' : 'incorrect'}\`;
            feedbackTitle.textContent = isCorrect ? '回答正确！' : '回答错误！';
            
            let correctAnswerText = '';
            const correctAnswersArray = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
            correctAnswerText = correctAnswersArray.map(idx => String.fromCharCode(65 + idx) + ". " + question.options[idx]).join('; ');
            
            feedbackContent.textContent = isCorrect ? '恭喜你！' : \`正确答案: \${correctAnswerText}\`;
            
            if (question.explanation) {
                explanationEl.textContent = \`解释: \${question.explanation}\`;
                explanationEl.style.display = 'block';
            } else {
                explanationEl.style.display = 'none';
            }
            feedbackContainer.style.display = 'block';
        }

        function nextQuizQuestion(quizId) { 
            const quizProgress = appState.quizProgress[quizId];
            quizProgress.currentQuestion++;
            if (quizProgress.currentQuestion >= quizProgress.questions.length) {
                finishQuiz(quizId);
            } else {
                renderQuestion(quizId, quizProgress.currentQuestion);
                saveAppData();
            }
        }
        
        function finishQuiz(quizId) {
            stopQuizTimer(quizId);
            const quizProgress = appState.quizProgress[quizId];
            quizProgress.score = calculateScore(quizId);
            quizProgress.completedAt = Date.now();
            saveAppData();
            showQuizResult(quizId);
            if (quizProgress.score === 100) {
                showPerfectScoreEffect(quizId);
            }
        }

        function calculateScore(quizId) {
            const quizProgress = appState.quizProgress[quizId];
            if (!quizProgress.questions || quizProgress.questions.length === 0) return 0;
            return Math.round((quizProgress.correctCount / quizProgress.questions.length) * 100);
        }

        function showQuizResult(quizId) {
            const quizNumber = quizId.slice(-1);
            const quizProgress = appState.quizProgress[quizId];
            
            // Hide question-related elements
            document.getElementById(\`question-container-\${quizNumber}\`).style.display = 'none';
            document.getElementById(\`feedback-container-\${quizNumber}\`).style.display = 'none';
            document.querySelector(\`#quiz\${quizNumber} .quiz-actions\`).style.display = 'none';
            document.querySelector(\`#quiz\${quizNumber} .quiz-header\`).style.display = 'none';
            document.querySelector(\`#quiz\${quizNumber} .quiz-progress\`).style.display = 'none';


            const resultContainer = document.getElementById(\`quiz-result-\${quizNumber}\`);
            resultContainer.style.display = 'block';
            resultContainer.querySelector('.result-score').textContent = \`\${quizProgress.score}分\`;
            document.getElementById(\`correct-count-\${quizNumber}\`).textContent = quizProgress.correctCount;
            document.getElementById(\`incorrect-count-\${quizNumber}\`).textContent = quizProgress.questions.length - quizProgress.correctCount;
            document.getElementById(\`time-spent-\${quizNumber}\`).textContent = formatTime(quizProgress.timeSpent);
            
            bindResultEvents(quizId);
        }
        
        function showPerfectScoreEffect(quizId) {
            const perfectScoreContainer = document.getElementById(\`perfect-score-\${quizId.slice(-1)}\`);
            if (perfectScoreContainer) perfectScoreContainer.classList.add('active');
            setTimeout(() => {
                if (perfectScoreContainer) perfectScoreContainer.classList.remove('active');
            }, 5000);
        }
        
        function bindQuizEvents(quizId) {
            const quizNumber = quizId.slice(-1);
            const submitBtn = document.getElementById(\`submit-btn-\${quizNumber}\`);
            const nextBtn = document.getElementById(\`next-quiz-btn-\${quizNumber}\`); 

            if(submitBtn) submitBtn.onclick = () => handleAnswer(quizId);
            if(nextBtn) nextBtn.onclick = () => nextQuizQuestion(quizId);
        }

        function bindResultEvents(quizId) {
            const quizNumber = quizId.slice(-1);
            document.getElementById(\`retry-btn-\${quizNumber}\`).onclick = () => {
                // Reset visibility for starting new quiz
                document.querySelector(\`#quiz\${quizNumber} .quiz-header\`).style.display = 'block';
                document.querySelector(\`#quiz\${quizNumber} .quiz-progress\`).style.display = 'flex';
                document.getElementById(\`quiz-result-\${quizNumber}\`).style.display = 'none';
                startNewQuiz(quizId);
            }
            document.getElementById(\`review-btn-\${quizNumber}\`).onclick = () => {
                 const resultMsgContainer = document.querySelector(\`#quiz - result -\${ quizNumber } .result - message\`);
                 if (resultMsgContainer) showUIMessage(resultMsgContainer.id, "查看错题功能待开发。", 'info'); // Need an ID for result message area
            };
            document.getElementById(\`return-home-btn-\${quizNumber}\`).onclick = () => navigateTo('video1');
            
            const perfectCloseBtn = document.getElementById(\`perfect-close-btn-\${quizNumber}\`);
            if(perfectCloseBtn) {
                perfectCloseBtn.onclick = () => {
                     document.getElementById(\`perfect-score-\${quizNumber}\`).classList.remove('active');
                };
            }
        }
        
        function updateQuizProgressUI(quizId) {
            const quizNumber = quizId.slice(-1);
            const quizProgress = appState.quizProgress[quizId];
            if (!quizProgress || !quizProgress.questions || quizProgress.questions.length === 0) return; // Added length check
            const currentQ = quizProgress.currentQuestion + 1;
            const totalQ = quizProgress.questions.length;
            const percent = totalQ > 0 ? Math.round(((currentQ -1) / totalQ) * 100) : 0; // Progress based on completed questions

            document.getElementById(\`current-question-\${quizNumber}\`).textContent = currentQ > totalQ ? totalQ : currentQ; 
            document.getElementById(\`total-questions-\${quizNumber}\`).textContent = totalQ;
            document.getElementById(\`progress-bar-\${quizNumber}\`).style.width = \`\${percent}%\`;
            document.getElementById(\`progress-percent-\${quizNumber}\`).textContent = \`\${percent}%\`;
        }
        
        function resetFeedbackContainer(quizId) {
            const quizNumber = quizId.slice(-1);
            const feedbackContainer = document.getElementById(\`feedback-container-\${quizNumber}\`);
            if(feedbackContainer) { // Check if element exists
                feedbackContainer.style.display = 'none';
                feedbackContainer.className = 'feedback-container'; 
            }
        }

        function showQuizLoading(quizId, isLoading) {
            const quizNumber = quizId.slice(-1);
            const questionContainer = document.getElementById(\`question-container-\${quizNumber}\`);
            if (isLoading && questionContainer) { // Check if element exists
                questionContainer.innerHTML = '<div class="loading-message"><p>正在加载题目...</p></div>';
            }
        }
        
        let quizTimers = {};
        function startQuizTimer(quizId) {
            if (quizTimers[quizId]) clearInterval(quizTimers[quizId]);
            const quizProgress = appState.quizProgress[quizId];
            if(!quizProgress) return; // Guard if quizProgress is not yet initialized
            const startTime = Date.now() - (quizProgress.timeSpent * 1000);
            quizTimers[quizId] = setInterval(() => {
                if(appState.quizProgress[quizId]) { // Check if still exists
                    appState.quizProgress[quizId].timeSpent = Math.floor((Date.now() - startTime) / 1000);
                } else {
                    clearInterval(quizTimers[quizId]); // Stop if quizProgress was reset
                }
            }, 1000);
        }
        function stopQuizTimer(quizId) {
            if (quizTimers[quizId]) {
                clearInterval(quizTimers[quizId]);
                delete quizTimers[quizId];
            }
        }
        function formatTime(seconds) {
            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            return \`\${m}:\${s.toString().padStart(2, '0')}\`;
        }

        function initLoadingIndicator() {
            const loadingIndicator = document.getElementById('loading-indicator');
            appState.showLoading = () => {
                if (!appState.isLoading) {
                    appState.isLoading = true;
                    if(loadingIndicator) loadingIndicator.classList.add('active');
                }
            };
            appState.hideLoading = () => {
                if (appState.isLoading) {
                    appState.isLoading = false;
                    if(loadingIndicator) loadingIndicator.classList.remove('active');
                }
            };
        }
        
        function initGlobalInteractiveEffects() {
            console.log('全局交互特效初始化 (CSS为主)');
        }

        function initUserSession() {
            const savedSession = localStorage.getItem('user_session');
            if (savedSession) {
                try {
                    const session = JSON.parse(savedSession);
                    appState.userSession = { ...session, lastVisit: Date.now(), visitCount: (session.visitCount || 0) + 1, deviceInfo: detectDeviceInfo() };
                } catch (e) { createNewSession(); }
            } else {
                createNewSession();
            }
            saveUserSession();
            initAppData(); 
            logPageVisit(appState.currentPage || (window.location.hash.substring(1) || 'video1')); 
        }

        function detectDeviceInfo() { 
            const ua = navigator.userAgent;
            let deviceType = 'desktop', browser = 'unknown', os = 'unknown';
            if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) deviceType = 'tablet';
            else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) deviceType = 'mobile';
            if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'chrome'; 
            else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'safari'; 
            else if (ua.includes('Firefox')) browser = 'firefox';
            else if (ua.includes('MSIE') || ua.includes('Trident/')) browser = 'ie';
            else if (ua.includes('Edg/')) browser = 'edge'; 
            else if (ua.includes('Edge/')) browser = 'edge-legacy'; 
            if (ua.includes('Windows')) os = 'windows';
            else if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'mac';
            else if (ua.includes('Linux')) os = 'linux';
            else if (ua.includes('Android')) os = 'android';
            else if (/(iPhone|iPad|iPod)/.test(ua)) os = 'ios';
            return { type: deviceType, browser, os, screenSize: \`\${window.innerWidth}x\${window.innerHeight}\` };
        }
        function createNewSession() {
            appState.userSession = { sessionId: generateSessionId(), firstVisit: Date.now(), lastVisit: Date.now(), visitCount: 1, deviceInfo: detectDeviceInfo() };
        }
        function saveUserSession() { localStorage.setItem('user_session', JSON.stringify(appState.userSession)); }
        function generateSessionId() { return 'sess-' + Date.now().toString(36) + Math.random().toString(36).substring(2); }

        function initAppData() {
            const defaultQuizProgress = { currentQuestion: 0, questions: [], answers: [], correctCount: 0, score: 0, startedAt: null, completedAt: null, timeSpent: 0 };
            const defaultVideoProgress = { watched: false, progress: 0, lastPosition: 0, watchedAt: null, watchCount: 0 };
            
            appState.quizProgress = {
                quiz1: { ...defaultQuizProgress },
                quiz2: { ...defaultQuizProgress }
            };
            appState.videoProgress = {
                video1: { ...defaultVideoProgress },
                video2: { ...defaultVideoProgress }
            };
            const savedAppData = localStorage.getItem('app_data');
            if (savedAppData) {
                try {
                    const data = JSON.parse(savedAppData);
                    // Deep merge for quizProgress and videoProgress if they exist
                    if (data.quizProgress) {
                        for (const quizKey in appState.quizProgress) {
                            if (data.quizProgress[quizKey]) {
                                appState.quizProgress[quizKey] = { ...appState.quizProgress[quizKey], ...data.quizProgress[quizKey] };
                            }
                        }
                    }
                    if (data.videoProgress) {
                         for (const videoKey in appState.videoProgress) {
                            if (data.videoProgress[videoKey]) {
                                appState.videoProgress[videoKey] = { ...appState.videoProgress[videoKey], ...data.videoProgress[videoKey] };
                            }
                        }
                    }
                } catch (e) { console.error("Error parsing saved app data", e); }
            }
            console.log('应用数据初始化/加载完成');
        }
        function saveAppData() {
            const dataToSave = {
                quizProgress: appState.quizProgress,
                videoProgress: appState.videoProgress,
            };
            localStorage.setItem('app_data', JSON.stringify(dataToSave));
        }
        
        async function logPageVisit(pageId) {
             if (!pageId) return; 
            const visitData = {
                pageId: pageId,
                timestamp: Date.now(),
                sessionId: appState.userSession.sessionId,
                deviceInfo: appState.userSession.deviceInfo
            };
            sendToServer('/api/visit', { method: 'POST', body: visitData })
                .then(response => {
                    if (response && response.success) console.log(\`访问 \${pageId} 已记录\`);
                    else console.warn(\`记录访问 \${pageId} 失败: \`, response?.error);
                })
                .catch(err => console.error(\`记录访问 \${pageId} 网络错误: \`, err));
        }

        async function getRandomQuestions(quizType, options = { count: 10 }) {
            const cacheKey = quizType;
            if (appState.cache.questions[cacheKey] && 
                appState.cache.questions.lastFetched && 
                (Date.now() - appState.cache.questions.lastFetched < 3600000)) {
                console.log(\`使用缓存题库: \${quizType}\`);
                return selectRandomQuestions(appState.cache.questions[cacheKey], options.count);
            }

            const response = await sendToServer(\`/api/questions?type=\${quizType}&count=\${options.count * 2}\`); 
            if (response && response.success && response.questions) {
                appState.cache.questions[cacheKey] = response.questions; 
                appState.cache.questions.lastFetched = Date.now();
                return selectRandomQuestions(response.questions, options.count);
            }
            console.error(\`获取题库 \${quizType} 失败, 使用模拟数据\`);
            const mock = getMockQuestions(quizType);
            return mock.slice(0, Math.min(options.count, mock.length)); // Ensure not to slice beyond mock length
        }

        function selectRandomQuestions(allQuestions, count) {
            if (!allQuestions || allQuestions.length === 0) return [];
            const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, Math.min(count, shuffled.length));
        }
        
        async function getVideoUrl(videoId) { 
            if (appState.cache.videoUrls[videoId] && 
                appState.cache.videoUrls.lastFetched && 
                (Date.now() - appState.cache.videoUrls.lastFetched < 3600000)) { 
                console.log(\`使用缓存视频URL: \${videoId}\`);
                return appState.cache.videoUrls[videoId];
            }

            const response = await sendToServer(\`/api/video?id=\${videoId}\`);
            if (response && response.success && response.url) {
                appState.cache.videoUrls[videoId] = response.url;
                appState.cache.videoUrls.lastFetched = Date.now();
                return response.url;
            }
            console.error(\`获取视频URL \${videoId} 失败, 使用默认URL\`);
            return getDefaultVideoUrl(videoId); 
        }

        function getDefaultVideoUrl(videoId) {
            const defaults = {
                'video1': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                'video2': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
            };
            return defaults[videoId] || defaults['video1'];
        }

        function getMockQuestions(type) {
            if (type === 'active_safety') return [
                {id:'as1',type:'single', question:'操作设备前首先应?',options:['立即操作','检查设备','问同事','看年限'],correctAnswer:1,explanation:'确保安全',difficulty:'easy'},
                {id:'as2',type:'single', question:'发现设备隐患?',options:['继续用','立即停用报告','自行修','等别人'],correctAnswer:1,explanation:'立即停用报告',difficulty:'easy'},
                {id:'as3',type:'single', question:'非个人防护装备?',options:['安全帽','防护镜','手机','防护手套'],correctAnswer:2,explanation:'手机非防护装备',difficulty:'easy'},
                {id:'as4',type:'single', question:'火灾时首先?',options:['逃离','报警','评估火情并行动','找贵重品'],correctAnswer:2,explanation:'评估并行动，小火尝试灭，大火报警疏散',difficulty:'medium'},
                {id:'as5',type:'single', question:'可能损坏设备?',options:['按手册','定期保养','超负荷运转','用前检查'],correctAnswer:2,explanation:'超负荷运转损坏设备',difficulty:'medium'},
                {id:'as6',type:'multiple', question:'安全操作核心原则?',options:['速度优先','安全第一','成本控制','个人舒适'],correctAnswer:[1],explanation:'安全第一',difficulty:'easy'},
                {id:'as7',type:'single', question:'非正确电气安全操作?',options:['用绝缘工具','戴绝缘手套','湿手操作','切断电源后操作'],correctAnswer:2,explanation:'湿手操作危险',difficulty:'medium'},
                {id:'as8',type:'boolean', question:'长时间操作设备应连续工作?',options:['是','否'],correctAnswer:1,explanation:'应适当休息',difficulty:'easy'},
                {id:'as9',type:'single', question:'安全标识红色代表?',options:['安全信息','警告信息','禁止信息','指示信息'],correctAnswer:2,explanation:'红色代表禁止',difficulty:'medium'},
                {id:'as10',type:'single', question:'操作新设备最重要?',options:['立即用','问同事感受','阅读手册','检查价格'],correctAnswer:2,explanation:'阅读手册',difficulty:'easy'}
            ];
            if (type === 'unauthorized') return [
                {id:'uo1',type:'single', question:'哪种属违规?',options:['按规程','戴护具','未经培训操作','定期检查'],correctAnswer:2,explanation:'未经培训危险',difficulty:'easy'},
                {id:'uo2',type:'single', question:'可能导致火灾?',options:['区域整洁','禁烟区吸烟','正确存放易燃物','检查消防设备'],correctAnswer:1,explanation:'禁烟区吸烟危险',difficulty:'easy'},
                {id:'uo3',type:'single', question:'增加触电风险?',options:['用合格设备','用破损电线','定期检查','设备干燥'],correctAnswer:1,explanation:'破损电线危险',difficulty:'easy'},
                {id:'uo4',type:'single', question:'哪种属违规操作?',options:['戴安全帽','遵守安全距离','拆除安全装置','用合适工具'],correctAnswer:2,explanation:'拆除安全装置危险',difficulty:'medium'},
                {id:'uo5',type:'boolean', question:'饮酒后可以操作设备?',options:['是','否'],correctAnswer:1,explanation:'饮酒后禁止操作',difficulty:'easy'},
                {id:'uo6',type:'single', question:'增加机械伤害风险?',options:['用适当工具','穿宽松衣物操作旋转设备','遵守规程','区域整洁'],correctAnswer:1,explanation:'宽松衣物易卷入',difficulty:'medium'},
                {id:'uo7',type:'single', question:'设备故障错误做法?',options:['立即停用','报告主管','自行修理','标记故障'],correctAnswer:2,explanation:'应由专业人员修理',difficulty:'medium'},
                {id:'uo8',type:'multiple', question:'违反化学品安全规定?',options:['按标签用','化学品装饮料瓶','用防护装备','遵循SDS'],correctAnswer:[1],explanation:'化学品装饮料瓶危险',difficulty:'hard'},
                {id:'uo9',type:'single', question:'阻碍紧急疏散?',options:['通道畅通','安全出口堆物','了解路线','参加演习'],correctAnswer:1,explanation:'安全出口堆物危险',difficulty:'medium'},
                {id:'uo10',type:'single', question:'可能导致设备过载?',options:['按规定负荷','定期保养','超出设计能力用','遵循手册'],correctAnswer:2,explanation:'超出设计能力用危险',difficulty:'medium'}
            ];
            return [];
        }

    </script>
</body>
</html>`;  // 确保添加反引号和分号