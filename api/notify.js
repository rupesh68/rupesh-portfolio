export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const WEBHOOK_URL = process.env.SECRET_DISCORD_WEBHOOK;

  try {
    // Better body handling
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // 1. Get the User's IP (Vercel uses x-real-ip or x-forwarded-for)
    const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for']?.split(',')[0] || '127.0.0.1';
// const ip = "8.8.8.8";
    // 2. Get Geolocation
    let locationInfo = 'Unknown Location';
    try {
      // Note: ip-api.com is HTTP by default; some hosts block outbound HTTP. 
      // Using https if they support it, or staying with http.
      const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
      const geoData = await geoRes.json();
      if (geoData.status === 'success') {
        locationInfo = `📍 ${geoData.city}, ${geoData.country} (${geoData.org})`;
      }
    } catch (e) {
      console.error('Geo lookup failed', e);
    }

    const finalMessage = `${body.message}\n🌐 **IP:** ${ip}\n${locationInfo}`;

    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: finalMessage }),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}