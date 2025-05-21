// functions/router.js
import { handleQuestionsApi } from './handlers/api/questionsApi';
import { handleStatsApi, handleClearStatsApi } from './handlers/api/statsApi';
import { handleVisitApi } from './handlers/api/visitApi';
import { handleVideoApi, handleUpdateVideoUrlApi } from './handlers/api/videoApi';
import { handleAdminLoginApi } from './handlers/api/adminAuthApi';
import { authenticateAdmin } from './services/authService';

export async function handleApiRequest(context) {
  const { request, path } = context;

  const apiRoutes = {
    '/api/questions': handleQuestionsApi,
    '/api/stats/clear': handleClearStatsApi,
    '/api/stats': handleStatsApi,
    '/api/visit': handleVisitApi,
    '/api/video/update': handleUpdateVideoUrlApi,
    '/api/video': handleVideoApi,
    '/api/admin/login': handleAdminLoginApi
  };

  for (const [route, handler] of Object.entries(apiRoutes)) {
    if (path.startsWith(route)) {
      // Centralized authentication check for protected API routes
      if (route === '/api/stats' || route === '/api/stats/clear' || route === '/api/video/update' || (route === '/api/questions' && request.method === 'POST')) {
        const authResult = await authenticateAdmin(context);
        if (!authResult.authenticated) {
          return new Response(JSON.stringify({ success: false, error: '未授权访问 (API)', reason: authResult.reason }), {
            status: 401,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          });
        }
      }
      return await handler(context);
    }
  }

  return new Response(JSON.stringify({ error: 'API not found', path: path }), {
    status: 404,
    headers: { 
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*' // Consider restricting this
    }
  });
}