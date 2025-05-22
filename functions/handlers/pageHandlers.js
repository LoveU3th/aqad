// functions/handlers/pageHandlers.js

/**
 * 处理主应用请求 (直接返回HTML内容)
 * @param {Object} context - 请求上下文
 * @returns {Response} - HTML响应
 */
export async function handleAppRequest(context) {
  // 直接返回HTML内容，不再重定向
  // 注意：通常Cloudflare Pages应该直接提供public/index.html，但如果没有被正确处理，这里作为备份
  return new Response(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0;url=/index.html" />
    <title>安全管理交互学习平台</title>
</head>
<body>
    <p>正在加载页面，请稍候...</p>
    <script>
        window.location.href = "/index.html";
    </script>
</body>
</html>`, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'no-cache'
    }
  });
}

/**
 * 处理管理页面请求 (认证后)
 * @param {Object} context - 请求上下文
 * @returns {Response} - HTML响应
 */
export async function handleAdminRequest(context) {
  // Authentication should have been handled before calling this function.
  // 返回HTML并重定向到admin路由
  return new Response(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0;url=/index.html#admin" />
    <title>安全管理交互学习平台 - 管理页面</title>
</head>
<body>
    <p>正在加载管理页面，请稍候...</p>
    <script>
        window.location.href = "/index.html#admin";
    </script>
</body>
</html>`, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'no-cache'
    }
  });
}

/**
 * 处理静态资源请求 (如果不由Pages直接服务)
 * @param {Object} context - 请求上下文
 * @returns {Response} - 资源响应或404
 */
export async function handleAssetRequest(context) {
  // In a typical Cloudflare Pages setup, static assets from the build output directory
  // (e.g., /public) are served automatically by Pages before hitting the Functions.
  // This handler would only be reached if a request for an asset-like path (e.g., /styles.css)
  // isn't found by Pages' static asset handler and falls through.
  //
  // If you intend for Functions to serve specific assets (e.g., from KV or R2),
  // you would implement that logic here.
  // For now, as a fallback, we'll return a 404.
  console.warn(`Asset request for "${context.path}" reached _worker.js. Ensure static assets are correctly deployed or handled.`);
  return new Response('资源不存在 (Asset not found via Function)', {
    status: 404,
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
  });
}
