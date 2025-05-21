// functions/handlers/api/videoApi.js
import { getVideoUrlFromKV, updateVideoUrlInKV } from '../../services/kvService';

/**
 * 处理获取视频URL API
 * @param {Object} context - 请求上下文
 * @returns {Promise<Response>} - JSON响应
 */
export async function handleVideoApi(context) {
  const { env, url } = context;

  if (!env.SAFETY_CONTENT) {
    return new Response(JSON.stringify({ success: false, error: '内容服务未配置 (Content service not configured)' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }

  const params = url.searchParams;
  const videoId = params.get('id');

  if (!videoId) {
    return new Response(JSON.stringify({ success: false, error: '缺少视频ID参数 (Missing video ID parameter)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }

  try {
    const videoUrl = await getVideoUrlFromKV(env, videoId);

    if (!videoUrl) {
      return new Response(JSON.stringify({ success: false, error: '视频不存在或URL未配置 (Video not found or URL not configured)' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      });
    }

    return new Response(JSON.stringify({ success: true, videoId: videoId, url: videoUrl }), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*' // Adjust CORS as needed
      }
    });
  } catch (error) {
    console.error('Error fetching video URL:', error);
    return new Response(JSON.stringify({ success: false, error: '处理视频请求时发生错误 (Error processing video request): ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }
}

/**
 * 处理更新视频URL API (管理员操作)
 * @param {Object} context - 请求上下文
 * @returns {Promise<Response>} - JSON响应
 */
export async function handleUpdateVideoUrlApi(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: '仅支持POST请求 (Only POST method is supported)' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }

  if (!env.SAFETY_CONTENT) {
    return new Response(JSON.stringify({ success: false, error: '内容服务未配置 (Content service not configured)' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }

  try {
    const { videoId, url } = await request.json();

    if (!videoId || !url) {
      return new Response(JSON.stringify({ success: false, error: '缺少videoId或url参数 (Missing videoId or url parameter)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      });
    }

    try {
      new URL(url); // Basic URL validation
    } catch (_) {
      return new Response(JSON.stringify({ success: false, error: '无效的URL格式 (Invalid URL format)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      });
    }
    
    await updateVideoUrlInKV(env, videoId, url);

    return new Response(JSON.stringify({ success: true, message: `视频 ${videoId} URL更新成功 (Video ${videoId} URL updated successfully)` }), {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  } catch (error) {
    console.error('Error updating video URL:', error);
    return new Response(JSON.stringify({ success: false, error: '更新视频URL时发生错误 (Error updating video URL): ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }
}
