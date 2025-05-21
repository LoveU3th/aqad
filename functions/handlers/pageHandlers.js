// functions/handlers/pageHandlers.js
import { INDEX_HTML } from '../htmlContent'; // Assuming INDEX_HTML is in htmlContent.js

/**
 * 处理主应用请求 (通常是返回 index.html)
 * @param {Object} context - 请求上下文
 * @returns {Response} - HTML响应
 */
export async function handleAppRequest(context) {
  return new Response(INDEX_HTML, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'public, max-age=600' // Cache for 10 minutes
    }
  });
}

/**
 * 处理管理页面请求 (认证后)
 * @param {Object} context - 请求上下文
 * @returns {Response} - HTML响应 (通常也是 index.html，由前端JS处理管理面板)
 */
export async function handleAdminRequest(context) {
  // Authentication should have been handled before calling this function.
  // This simply serves the main application HTML, and client-side JavaScript
  // will handle rendering the admin panel based on authentication state.
  return handleAppRequest(context);
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
