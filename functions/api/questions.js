// functions/api/questions.js - Cloudflare Pages Functions route file
import { handleQuestionsApi } from '../handlers/api/questionsApi';
import { authenticateAdmin } from '../services/authService';

// GET requests don't need authentication
export async function onRequestGet(context) {
    return await handleQuestionsApi(context);
}

// POST requests need authentication
export async function onRequestPost(context) {
    const authResult = await authenticateAdmin(context);
    if (!authResult.authenticated) {
        return new Response(JSON.stringify({ success: false, error: '未授权访问 (API)', reason: authResult.reason }), {
            status: 401,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        });
    }

    return await handleQuestionsApi(context);
}

// Correctly handle OPTIONS requests for CORS preflight
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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