// /api/ai.js
// Runs on Vercel's servers, never in the user's browser.
// The Anthropic API key lives only in Vercel's Environment Variables (ANTHROPIC_API_KEY),
// so it's never visible in your HTML/JS or in the GitHub repo.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured: ANTHROPIC_API_KEY is not set' });
  }

  try {
    const { model, max_tokens, system, messages, tools } = req.body || {};

    if (!messages) {
      return res.status(400).json({ error: 'Missing "messages" in request body' });
    }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-6',
        max_tokens: max_tokens || 1000,
        system,
        messages,
        ...(tools ? { tools } : {})
      })
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      // Forward Anthropic's error message (without leaking the key) for easier debugging
      return res.status(anthropicRes.status).json({ error: data.error || data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('AI proxy error:', err);
    return res.status(500).json({ error: 'AI proxy request failed' });
  }
}
