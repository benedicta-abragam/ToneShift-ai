const axios = require('axios');

const rewriteMessage = async (message, tone) => {
  const prompt = `Rewrite the following message in a ${tone} tone.
Keep the meaning the same. Only return the rewritten message, no explanation, no quotes.

Message: "${message}"`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    const rewrittenText = response.data.choices[0].message.content;
    return rewrittenText.trim();
  } catch (err) {
    console.error('GROQ ERROR DETAILS:', err.response?.data || err.message);
    throw err;
  }
};

module.exports = rewriteMessage;