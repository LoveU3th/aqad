// functions/_worker.js
import { authenticateAdmin, createAuthenticationResponse } from './services/authService';
import { handleAdminRequest, handleAppRequest, handleAssetRequest } from './handlers/pageHandlers';

/**
 * Cloudflare Pages Functions entry point.
 * This function will be invoked for requests that don't match specific route files.
 */
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  const requestContext = {
    request,
    url,
    path,
    env,
  };

  try {
    // 1. API 请求会被 functions/api/ 目录下的相应文件处理
    // Routes 处理（该处理已由各个专门的路由文件接管）

    // 2. 管理页面请求
    if (path.startsWith('/admin')) {
      const authResult = await authenticateAdmin(requestContext);
      if (!authResult.authenticated) {
        return createAuthenticationResponse();
      }
      return await handleAdminRequest(requestContext);
    }

    // 3. 静态资源请求 (Pages handles most static assets from the output directory)
    if (path.includes('.') && !path.endsWith('.html')) {
      return await handleAssetRequest(requestContext);
    }

    // 4. 主应用请求（根路径直接返回index.html内容）
    if (path === '/' || path === '') {
      // 对于根路径请求，直接返回内容而不重定向
      // /routes/index.js 或特定路由文件会处理这个请求
      return; // 允许 /routes/index.js 处理
    }

    // 5. 其他页面请求
    return await handleAppRequest(requestContext);

  } catch (error) {
    console.error('请求处理错误:', error.stack || error);
    return new Response('服务器内部错误', { status: 500, headers: { 'Content-Type': 'text/plain;charset=UTF-8' } });
  }
}
