// api/notify.js
export const config = {
  runtime: 'nodejs',
};

const { process } = globalThis;

export default async function handler(req, res) {
  // 1. Set CORS headers so your frontend can talk to this API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle browser "preflight" requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const WEBHOOK_URL = process.env.SECRET_DISCORD_WEBHOOK;

  if (!WEBHOOK_URL) {
    console.error("Missing SECRET_DISCORD_WEBHOOK in Vercel settings");
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        content: body.message || "New activity detected" 
      }),
    });

    if (!response.ok) {
      throw new Error(`Discord responded with ${response.status}`);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Discord API Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}