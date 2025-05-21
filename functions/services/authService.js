// functions/services/authService.js

/**
 * 验证管理员身份 (支持 Bearer Token 和 Basic Auth)
 * @param {Object} context - 请求上下文，包含 request 和 env
 * @returns {Promise<Object>} - 认证结果和权限
 */
export async function authenticateAdmin(context) {
    const { request, env } = context;
  
    // 检查 KV 命名空间是否存在
    if (!env || !env.SAFETY_ADMIN) {
      console.error('SAFETY_ADMIN KV namespace not available for authentication.');
      return { authenticated: false, reason: 'admin_service_unavailable' };
    }
  
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return { authenticated: false, reason: 'missing_credentials' };
    }
  
    try {
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7); // "Bearer ".length
        const parts = token.split('-');
        if (parts.length !== 4) {
          return { authenticated: false, reason: 'invalid_token_format' };
        }
        const [username, issueTimeStr, expiryTimeStr] = parts; // randomPart is not used for validation here
        const issueTime = parseInt(issueTimeStr);
        const expiryTime = parseInt(expiryTimeStr);
  
        if (isNaN(issueTime) || isNaN(expiryTime)) {
          return { authenticated: false, reason: 'invalid_token_timestamp_format' };
        }
  
        if (Date.now() > expiryTime) {
          return { authenticated: false, reason: 'token_expired' };
        }
        
        const adminInfo = await env.SAFETY_ADMIN.get(username, { type: 'json' });
        if (!adminInfo) {
          return { authenticated: false, reason: 'invalid_user_in_token' };
        }
        // Basic validation passed
        return {
          authenticated: true,
          username: username,
          permissions: adminInfo.permissions || ['read'],
          displayName: adminInfo.displayName || username,
          authMethod: 'token'
        };
  
      } else if (authHeader.startsWith('Basic ')) {
        const credentials = atob(authHeader.split(' ')[1]); // In Node.js on Pages, atob is available globally
        const [username, password] = credentials.split(':');
  
        const adminInfo = await env.SAFETY_ADMIN.get(username, { type: 'json' });
        if (!adminInfo) {
          return { authenticated: false, reason: 'invalid_user' };
        }
  
        // IMPORTANT: In a real application, passwords should be hashed and compared securely.
        // This is a simplified example.
        if (password !== adminInfo.password) {
          return { authenticated: false, reason: 'invalid_password' };
        }
  
        return {
          authenticated: true,
          username: username,
          permissions: adminInfo.permissions || ['read'],
          displayName: adminInfo.displayName || username,
          authMethod: 'basic'
        };
      } else {
        return { authenticated: false, reason: 'unsupported_auth_scheme' };
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return { authenticated: false, reason: 'auth_error', error: error.message };
    }
  }
  
  /**
   * 创建认证响应 (WWW-Authenticate header for Basic Auth)
   * @returns {Response} - 认证响应
   */
  export function createAuthenticationResponse() {
    return new Response('需要认证 (Authentication Required)', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="安全管理系统管理页面 (Secure Area)"', // Realm can be anything descriptive
        'Content-Type': 'text/plain;charset=UTF-8'
      }
    });
  }
  
  /**
   * 生成会话令牌
   * @param {string} username - 用户名
   * @param {number} expiresInMs - 令牌有效期（毫秒），默认为1小时
   * @returns {string} - 会话令牌
   */
  export function generateSessionToken(username, expiresInMs = 3600 * 1000) {
    const issueTime = Date.now();
    const expiryTime = issueTime + expiresInMs;
    // Generate a more robust random part if possible, crypto.randomUUID() is good if available
    const randomPart = typeof crypto !== 'undefined' && crypto.randomUUID ? 
                       crypto.randomUUID().split('-')[0] : 
                       Math.random().toString(36).substring(2, 10);
    return `${username}-${issueTime}-${expiryTime}-${randomPart}`;
  }
  