// functions/index.js
// 此文件处理根路径请求，直接返回HTML内容

export async function onRequest(context) {
    // 读取public/index.html文件内容
    return new Response(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=/" />
    <title>重定向中...</title>
</head>
<body>
    <p>正在加载页面，请稍候...</p>
    <script>
        window.location.href = "/";
    </script>
</body>
</html>`, {
        status: 200,
        headers: {
            'Content-Type': 'text/html;charset=UTF-8',
            'Cache-Control': 'no-store'
        }
    });
} 