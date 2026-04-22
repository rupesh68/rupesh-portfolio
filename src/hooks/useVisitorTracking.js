import { useEffect, useRef } from 'react';

async function sendDiscordNotification(message) {
  try {
    // Added a check to ensure we don't send empty messages
    if (!message) return;

    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      keepalive: true, 
    });
  } catch (err) {
    console.error('Notification failed', err);
  }
}

export function useVisitorTracking() {
  const hasFiredEnter = useRef(false);
  const hasFiredLeave = useRef(false); // Prevent multiple leave pings

  useEffect(() => {
    const getTimestamp = () => new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 1. Enter Event
    if (!hasFiredEnter.current) {
      sendDiscordNotification(`🟢 **New Visitor!**\n📅 **Time:** ${getTimestamp()}`);
      hasFiredEnter.current = true;
    }

    // 2. Leave Event Logic
    const handleLeave = () => {
      if (hasFiredLeave.current) return;
      hasFiredLeave.current = true;
      sendDiscordNotification(`🔴 **Visitor Left**\n📅 **Time:** ${getTimestamp()}`);
    };

    // 'beforeunload' is more reliable for "closing" than visibilitychange
    window.addEventListener('beforeunload', handleLeave);

    return () => {
      window.removeEventListener('beforeunload', handleLeave);
    };
  }, []);
}