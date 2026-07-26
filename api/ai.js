// /api/ai.js
// Runs on Vercel's servers, never in the user's browser.
// The Gemini API key lives only in Vercel's Environment Variables (GEMINI_API_KEY),
// so it's never visible in your HTML/JS or in the GitHub repo.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured: GEMINI_API_KEY is not set' });
  }

  try {
    const { model, max_tokens, system, messages } = req.body || {};

    if (!messages) {
      return res.status(400).json({ error: 'Missing "messages" in request body' });
    }

    // Build Gemini contents array from Anthropic-style messages
    const contents = [];

    // Prepend system prompt as a user turn if present
    if (system) {
      contents.push({ role: 'user', parts: [{ text: '[SYSTEM INSTRUCTIONS]\n' + system + '\n[END SYSTEM INSTRUCTIONS]' }] });
      contents.push({ role: 'model', parts: [{ text: 'Understood. I will follow those instructions.' }] });
    }

    for (const msg of messages) {
      const role = msg.role === 'assistant' ? 'model' : 'user';
      const text = typeof msg.content === 'string' ? msg.content
        : Array.isArray(msg.content) ? msg.content.map(c => c.text || '').join('') : String(msg.content);
      contents.push({ role, parts: [{ text }] });
    }

    // Using gemini-3.6-flash — latest model (launched July 21, 2026)
    // Free tier available via Google AI Studio
    const geminiModel = 'gemini-3.6-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: max_tokens || 1000,
          temperature: 0.7,
        }
      })
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json({ error: data.error || data });
    }

    // Convert Gemini response format → Anthropic-compatible format
    // so index.html doesn't need changes in how it reads the reply
    const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const anthropicCompat = {
      id: 'gemini-response',
      type: 'message',
      role: 'assistant',
      content: [{ type: 'text', text: geminiText }],
      model: geminiModel,
      stop_reason: 'end_turn',
      usage: { input_tokens: 0, output_tokens: 0 }
    };

    return res.status(200).json(anthropicCompat);
  } catch (err) {
    console.error('AI proxy error:', err);
    return res.status(500).json({ error: 'AI proxy request failed' });
  }
}
