// functions/handlers/pageHandlers.js

/**
 * 处理主应用请求 (重定向到静态index.html)
 * @param {Object} context - 请求上下文
 * @returns {Response} - 重定向响应
 */
export async function handleAppRequest(context) {
  // 将请求重定向到根目录，让Cloudflare Pages提供静态的index.html文件
  // 注意：通常来说，Cloudflare Pages会自动处理对根路径的请求并提供public/index.html
  // 这个函数只是作为备用，以防直接访问了由Functions处理的非API路径
  return new Response(null, {
    status: 302, // 临时重定向
    headers: {
      'Location': '/',
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
  // 重定向到根目录，让前端JS处理管理面板的渲染
  return new Response(null, {
    status: 302, // 临时重定向
    headers: {
      'Location': '/#admin',
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
