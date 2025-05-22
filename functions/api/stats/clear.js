// functions/api/stats/clear.js - Cloudflare Pages Functions route file
import { handleClearStatsApi } from '../../handlers/api/statsApi';
import { authenticateAdmin } from '../../services/authService';

export async function onRequestPost(context) {
    // Authenticate before allowing access to clear stats
    const authResult = await authenticateAdmin(context);
    if (!authResult.authenticated) {
        return new Response(JSON.stringify({ success: false, error: '未授权访问 (API)', reason: authResult.reason }), {
            status: 401,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        });
    }

    return await handleClearStatsApi(context);
}

// Correctly handle OPTIONS requests for CORS preflight
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}

// Return 405 for other methods
export function onRequest() {
    return new Response(JSON.stringify({ success: false, error: '不支持的请求方法 (Unsupported request method)' }), {
        status: 405,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': '*'
        }
    });
} 