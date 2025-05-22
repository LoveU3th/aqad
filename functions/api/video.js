// functions/api/video.js - Cloudflare Pages Functions route file
import { handleVideoApi } from '../handlers/api/videoApi';

export async function onRequestGet(context) {
    return await handleVideoApi(context);
}

// Correctly handle OPTIONS requests for CORS preflight
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
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