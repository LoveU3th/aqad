// functions/handlers/api/questionsApi.js
import { getQuestionBank } from '../../services/kvService';

/**
 * 处理题库API
 * @param {Object} context - 请求上下文
 * @returns {Promise<Response>} - JSON响应
 */
export async function handleQuestionsApi(context) {
  const { request, env, url } = context;

  if (!env.SAFETY_CONTENT) {
    return new Response(JSON.stringify({ success: false, error: '内容服务未配置 (Content service not configured)' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }

  const params = url.searchParams;
  const quizType = params.get('type') || 'active_safety';
  const countParam = params.get('count');
  const count = countParam ? parseInt(countParam) : 10;


  if (isNaN(count) || count <= 0) {
    return new Response(JSON.stringify({ success: false, error: '无效的题目数量 (Invalid question count)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }

  try {
    const questionBankKey = quizType === 'unauthorized'
      ? 'unauthorized_operation_questions'
      : 'active_safety_questions';

    const allQuestions = await getQuestionBank(env, questionBankKey);

    if (!allQuestions) {
      return new Response(JSON.stringify({ success: false, error: '题库不存在或为空 (Question bank not found or empty)' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      });
    }

    if (!Array.isArray(allQuestions)) {
        console.error("Question bank data is not an array:", allQuestions);
        return new Response(JSON.stringify({ success: false, error: '题库数据格式错误 (Invalid question bank data format)' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        });
    }

    // 随机抽取题目
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length)); // Ensure count doesn't exceed available questions

    return new Response(JSON.stringify({
      success: true,
      questions: selectedQuestions
    }), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*' // Adjust CORS as needed
      }
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return new Response(JSON.stringify({ success: false, error: '处理题库请求时发生错误 (Error processing questions request): ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }
}
