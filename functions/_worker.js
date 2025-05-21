// functions/_worker.js
import { handleApiRequest } from './router';
import { authenticateAdmin, createAuthenticationResponse } from './services/authService';
import { handleAdminRequest, handleAppRequest, handleAssetRequest } from './handlers/pageHandlers';

/**
 * Cloudflare Pages Functions entry point.
 * This function will be invoked for every request.
 */
export async function onRequest(context) {
  // context.request is the Request object
  // context.env contains bindings (KV, DO, R2, Vars, Secrets)
  // context.params contains route parameters (e.g. /books/[id])
  // context.waitUntil extends the lifetime of the request
  // context.next sends the request to the next function in the chain (if any)
  // context.functionPath is the path to the function file
  
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  const requestContext = {
    request,
    url,
    path,
    env, // Pass the full env object from Pages context
    // Add other context properties if needed by handlers, e.g., context.params
  };

  try {
    // 1. API 请求处理
    if (path.startsWith('/api/')) {
      return await handleApiRequest(requestContext);
    }

    // 2. 管理页面请求
    if (path.startsWith('/admin')) {
      const authResult = await authenticateAdmin(requestContext);
      if (!authResult.authenticated) {
        return createAuthenticationResponse();
      }
      return await handleAdminRequest(requestContext);
    }

    // 3. 静态资源请求 (Pages handles most static assets from the output directory)
    // This handler is for cases where the Worker might need to serve specific assets
    // not covered by the standard Pages static asset serving.
    // For a typical Pages setup, this might not be strictly necessary if all assets are in the build output dir.
    if (path.includes('.') && !path.endsWith('.html')) {
      // Cloudflare Pages will serve static assets from your build output directory first.
      // This function would only be hit if the asset is not found by Pages static serving
      // and the request falls through to the `_worker.js` catch-all.
      // You might want to return a 404 or proxy to an asset store if needed.
      // For now, let's assume Pages handles static assets and this is a fallback.
      return await handleAssetRequest(requestContext); 
    }

    // 4. 主应用请求（默认返回主HTML via handleAppRequest）
    // For SPA, all non-API, non-asset routes typically serve the main index.html
    return await handleAppRequest(requestContext);

  } catch (error) {
    console.error('请求处理错误:', error.stack || error);
    return new Response('服务器内部错误', { status: 500, headers: { 'Content-Type': 'text/plain;charset=UTF-8' } });
  }
}
