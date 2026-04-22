// // api/notify.js
// export const config = {
//   runtime: 'nodejs',
// };

// const { process } = globalThis;

// export default async function handler(req, res) {
//   // 1. Set CORS headers so your frontend can talk to this API
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   // Handle browser "preflight" requests
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }

//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method Not Allowed' });
//   }

//   const WEBHOOK_URL = process.env.SECRET_DISCORD_WEBHOOK;

//   if (!WEBHOOK_URL) {
//     console.error("Missing SECRET_DISCORD_WEBHOOK in Vercel settings");
//     return res.status(500).json({ error: 'Server configuration error' });
//   }

//   try {
//     const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
//     const response = await fetch(WEBHOOK_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ 
//         content: body.message || "New activity detected" 
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`Discord responded with ${response.status}`);
//     }

//     return res.status(200).json({ success: true });
//   } catch (err) {
//     console.error('Discord API Error:', err.message);
//     return res.status(500).json({ error: err.message });
//   }
// }
export const config = {
  runtime: 'nodejs',
};
const { process } = globalThis;
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const WEBHOOK_URL = process.env.SECRET_DISCORD_WEBHOOK;

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // 1. Get the User's IP
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;

    // 2. Get Geolocation (City, Country, Org)
    let locationInfo = "Unknown Location";
    try {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
      const geoData = await geoRes.json();
      if (geoData.status === 'success') {
        locationInfo = `📍 ${geoData.city}, ${geoData.country} (${geoData.org})`;
      }
    } catch (e) {
      console.error("Geo lookup failed", e);
    }

    // 3. Combine everything for Discord
    const finalMessage = `${body.message}\n🌐 **IP:** ${ip}\n${locationInfo}`;

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: finalMessage }),
    });
     if (!response.ok) {
       throw new Error(`Discord responded with ${response.status}`);
     }
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}