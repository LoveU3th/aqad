// functions/index.js
// 此文件处理根路径请求，确保静态index.html能正确显示

export async function onRequest(context) {
    // 返回一个响应，表明请求已被处理，但实际上Cloudflare Pages应该在此之前
    // 已经提供了public/index.html文件作为静态资源
    return new Response(null, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-store'
        }
    });
} 