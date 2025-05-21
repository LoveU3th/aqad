// functions/handlers/api/adminAuthApi.js
import { generateSessionToken } from '../../services/authService';

/**
 * 处理管理员登录API
 * @param {Object} context - 请求上下文 (request, env, url, path)
 * @returns {Promise<Response>} - JSON响应
 */
export async function handleAdminLoginApi(context) {
  const { request, env } = context;

  if (!env.SAFETY_ADMIN) {
    return new Response(JSON.stringify({ success: false, error: '管理服务未配置 (Admin service not configured)' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: '不支持的请求方法 (Unsupported request method)' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }

  try {
    const loginData = await request.json();
    const { username, password } = loginData;

    if (!username || !password) {
      return new Response(JSON.stringify({ success: false, error: '用户名和密码不能为空 (Username and password cannot be empty)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      });
    }

    const adminInfo = await env.SAFETY_ADMIN.get(username, { type: 'json' });

    if (!adminInfo) {
      return new Response(JSON.stringify({ success: false, error: '用户名或密码错误 (Invalid username or password)' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      });
    }

    // IMPORTANT: Password comparison should be done using a secure hashing algorithm in production.
    if (password !== adminInfo.password) {
      return new Response(JSON.stringify({ success: false, error: '用户名或密码错误 (Invalid username or password)' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      });
    }

    const token = generateSessionToken(username, 3600 * 1000 * 24); // 24-hour token

    return new Response(JSON.stringify({
      success: true,
      username: username,
      displayName: adminInfo.displayName || username,
      permissions: adminInfo.permissions || ['read'],
      token: token
    }), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*' // Adjust CORS as needed
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return new Response(JSON.stringify({ success: false, error: '登录处理失败 (Login processing failed): ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }
}
