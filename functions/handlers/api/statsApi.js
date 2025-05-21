// functions/handlers/api/statsApi.js
import { getStats, getInitialStatsStructure, saveStats } from '../../services/kvService';

/**
 * 处理获取统计数据API
 * @param {Object} context - 请求上下文
 * @returns {Promise<Response>} - JSON响应
 */
export async function handleStatsApi(context) {
  const { env } = context;

  if (!env.SAFETY_STATS) {
    return new Response(JSON.stringify({ success: false, error: '统计服务未配置 (Statistics service not configured)' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }

  try {
    const stats = await getStats(env);
    return new Response(JSON.stringify({ success: true, stats: stats }), {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new Response(JSON.stringify({ success: false, error: '获取统计数据时发生错误 (Error fetching stats): ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }
}

/**
 * 处理清空统计数据API
 * @param {Object} context - 请求上下文
 * @returns {Promise<Response>} - JSON响应
 */
export async function handleClearStatsApi(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: '仅支持POST方法 (Only POST method is supported)' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }

  if (!env.SAFETY_STATS) {
    return new Response(JSON.stringify({ success: false, error: '统计服务未配置 (Statistics service not configured)' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }

  try {
    const initialStats = getInitialStatsStructure();
    await saveStats(env, initialStats); // Use saveStats from kvService
    
    return new Response(JSON.stringify({ success: true, message: '统计数据已清空 (Statistics data cleared)' }), {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  } catch (error) {
    console.error('Error clearing stats:', error);
    return new Response(JSON.stringify({ success: false, error: '清空统计数据时发生错误 (Error clearing stats): ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }
}
