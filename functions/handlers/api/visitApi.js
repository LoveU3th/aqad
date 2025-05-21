// functions/handlers/api/visitApi.js
import { getStats, saveStats } from '../../services/kvService';

/**
 * 处理访问统计API
 * @param {Object} context - 请求上下文
 * @returns {Promise<Response>} - JSON响应
 */
export async function handleVisitApi(context) {
  const { request, env } = context;

  if (!env.SAFETY_STATS) {
    return new Response(JSON.stringify({ success: false, error: '统计服务未配置 (Statistics service not configured)' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }

  if (request.method === 'POST') {
    try {
      const visitData = await request.json();
      let stats = await getStats(env); // Get current stats

      // Ensure stats.visits and its sub-properties are initialized if they don't exist
      stats.visits = stats.visits || { total: 0, byDate: {}, byDevice: {} };
      stats.visits.byDate = stats.visits.byDate || {};
      stats.visits.byDevice = stats.visits.byDevice || {};


      stats.visits.total = (stats.visits.total || 0) + 1;

      const today = new Date().toISOString().split('T')[0];
      stats.visits.byDate[today] = (stats.visits.byDate[today] || 0) + 1;

      const deviceType = visitData.deviceInfo?.type || 'unknown';
      stats.visits.byDevice[deviceType] = (stats.visits.byDevice[deviceType] || 0) + 1;
      
      // If you want to track byHour, ensure stats.visits.byHour is initialized
      // stats.visits.byHour = stats.visits.byHour || Array(24).fill(0);
      // const hour = new Date().getHours();
      // stats.visits.byHour[hour] = (stats.visits.byHour[hour] || 0) + 1;

      await saveStats(env, stats); // Save updated stats

      return new Response(JSON.stringify({ success: true, message: '访问已记录 (Visit recorded)' }), {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      });
    } catch (error) {
      console.error('Error processing visit:', error);
      return new Response(JSON.stringify({ success: false, error: '处理访问统计时发生错误 (Error processing visit): ' + error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      });
    }
  }

  return new Response(JSON.stringify({ success: false, error: '不支持的请求方法 (Unsupported request method)' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  });
}
