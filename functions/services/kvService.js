// functions/services/kvService.js

/**
 * 获取初始统计数据结构
 * @returns {Object} - 初始统计数据对象
 */
export function getInitialStatsStructure() {
    return {
        visits: {
            total: 0,
            unique: 0, 
            byDate: {},
            byHour: Array(24).fill(0),
            byDevice: { desktop: 0, tablet: 0, mobile: 0, unknown: 0 }
        },
        videoStats: {
            video1: { views: 0, completions: 0, completionRate: 0, averageWatchTime: 0 },
            video2: { views: 0, completions: 0, completionRate: 0, averageWatchTime: 0 }
        },
        quizStats: {
            quiz1: { attempts: 0, completions: 0, averageScore: 0, perfectScores: 0 },
            quiz2: { attempts: 0, completions: 0, averageScore: 0, perfectScores: 0 }
        },
        performance: { 
            averageLoadTime: 0,
            errorRate: 0,
            lastUpdated: new Date().toISOString()
        }
    };
}

/**
 * 从KV存储获取统计数据
 * @param {Object} env - Cloudflare Pages environment object containing KV bindings
 * @returns {Promise<Object>} - 统计数据对象
 */
export async function getStats(env) {
  if (!env || !env.SAFETY_STATS) {
    console.warn('SAFETY_STATS KV namespace not available in env, returning default stats structure.');
    return getInitialStatsStructure();
  }
  
  const statsData = await env.SAFETY_STATS.get('stats', { type: 'json' });

  if (!statsData) {
    return getInitialStatsStructure();
  }
  
  // Merge with default structure to ensure all keys exist, even if KV data is old/incomplete
  const defaultStructure = getInitialStatsStructure();
  return {
      visits: { ...defaultStructure.visits, ...(statsData.visits || {}) },
      videoStats: { ...defaultStructure.videoStats, ...(statsData.videoStats || {}) },
      quizStats: { ...defaultStructure.quizStats, ...(statsData.quizStats || {}) },
      performance: { ...defaultStructure.performance, ...(statsData.performance || {}) }
  };
}

/**
 * 获取特定题库
 * @param {Object} env - Cloudflare Pages environment object
 * @param {string} questionBankKey - 题库的键名 (e.g., 'active_safety_questions')
 * @returns {Promise<Array|null>} - 题目数组或 null (如果未找到)
 */
export async function getQuestionBank(env, questionBankKey) {
  if (!env || !env.SAFETY_CONTENT) {
    console.error('SAFETY_CONTENT KV namespace not available in env.');
    return null;
  }
  const questionsJson = await env.SAFETY_CONTENT.get(questionBankKey);
  if (!questionsJson) {
    return null;
  }
  try {
    return JSON.parse(questionsJson);
  } catch (e) {
    console.error(`Error parsing question bank ${questionBankKey}:`, e);
    return null;
  }
}

/**
 * 获取特定视频URL
 * @param {Object} env - Cloudflare Pages environment object
 * @param {string} videoId - 视频ID (e.g., 'video1')
 * @returns {Promise<string|null>} - 视频URL或 null
 */
export async function getVideoUrlFromKV(env, videoId) {
  if (!env || !env.SAFETY_CONTENT) {
    console.error('SAFETY_CONTENT KV namespace not available in env.');
    return null;
  }
  return await env.SAFETY_CONTENT.get(`video_url_${videoId}`);
}

/**
 * 更新特定视频URL
 * @param {Object} env - Cloudflare Pages environment object
 * @param {string} videoId - 视频ID
 * @param {string} url - 新的视频URL
 * @returns {Promise<void>}
 */
export async function updateVideoUrlInKV(env, videoId, url) {
  if (!env || !env.SAFETY_CONTENT) {
    console.error('SAFETY_CONTENT KV namespace not available in env. Cannot update video URL.');
    throw new Error('Content service not configured.');
  }
  await env.SAFETY_CONTENT.put(`video_url_${videoId}`, url);
}

/**
 * 保存统计数据到KV
 * @param {Object} env - Cloudflare Pages environment object
 * @param {Object} statsData - 要保存的统计数据
 * @returns {Promise<void>}
 */
export async function saveStats(env, statsData) {
    if (!env || !env.SAFETY_STATS) {
        console.error('SAFETY_STATS KV namespace not available in env. Cannot save stats.');
        throw new Error('Statistics service not configured.');
    }
    await env.SAFETY_STATS.put('stats', JSON.stringify(statsData));
}
