import { useEffect, useRef } from 'react';

const WEBHOOK_URL =
  'https://discord.com/api/webhooks/1496237244023836702/iFs8TGXOuq9AM-33ILo6klS2hwMs3b4Wipx7q8KDlmCh8etAhay9SdbHs4gRwVmgU_Mb';

async function sendDiscordNotification(message) {
  let locationInfo = 'Unknown Location';
  try {
    const geo = await fetch('http://ip-api.com/json/').then((r) => r.json());
    if (geo.status === 'success') {
      locationInfo = `📍 ${geo.city}, ${geo.country} (${geo.org})`;
    }
  } catch (_) {}

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: `${message}\n${locationInfo}` }),
      keepalive: true,
    });
  } catch (err) {
    console.error('Notification failed', err);
  }
}

export function useVisitorTracking() {
  const hasFiredEnter = useRef(false);

  useEffect(() => {
    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
    });

    if (!hasFiredEnter.current) {
      sendDiscordNotification(`🟢 **New Visitor!**\n📅 **Time:** ${timestamp}`);
      hasFiredEnter.current = true;
    }

    const handleLeave = () => {
      const leaveTime = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
      });
      sendDiscordNotification(`🔴 **Visitor Left**\n📅 **Time:** ${leaveTime}`);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') handleLeave();
    };

    window.addEventListener('beforeunload', handleLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}
