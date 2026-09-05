const axios = require('axios');

const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

const rewriteMessage = async (message, tone) => {
  const prompt = `Rewrite the following message in a ${tone} tone.
Keep the meaning the same. Only return the rewritten message, no explanation, no quotes.

Message: "${message}"`;

  console.log('[geminiService] GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
  console.log('[geminiService] Using GROQ_MODEL:', GROQ_MODEL);

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        timeout: 30000,
      }
    );

    console.log('[geminiService] Groq responded with status:', response.status);

    const rewrittenText = response.data.choices[0].message.content;
    return rewrittenText.trim();
  } catch (err) {
    console.error('[geminiService] GROQ ERROR DETAILS:', err.response?.status, err.response?.data || err.message);
    if (err.code === 'ECONNABORTED') {
      throw new Error('The AI service took too long to respond');
    }
    throw new Error('The AI service failed to rewrite the message');
  }
};

module.exports = rewriteMessage;