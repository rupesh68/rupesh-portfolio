// import { useEffect, useRef } from 'react';

// const WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK;

// async function sendDiscordNotification(message) {
//   try {
//     await fetch(WEBHOOK_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ content: message }),
//     });
//   } catch (err) {
//     console.error('Notification failed', err);
//   }
// }

// export function useVisitorTracking() {
//   const startTime = useRef(null);

//   useEffect(() => {
//     console.log('Webhook URL:', import.meta.env.VITE_DISCORD_WEBHOOK);
//     console.log('Tracking started...');

//     startTime.current = Date.now();

//     sendDiscordNotification(`🟢 **New Visitor!**`);

//     const handleLeave = () => {
//       sendDiscordNotification(`🔴 **Visitor Left**`);
//     };

//     window.addEventListener('beforeunload', handleLeave);
//     document.addEventListener('visibilitychange', () => {
//       if (document.visibilityState === 'hidden') handleLeave();
//     });

//     return () => {
//       window.removeEventListener('beforeunload', handleLeave);
//     };
//   }, []);
// }
import { useEffect, useRef } from 'react';

const WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK;

async function sendDiscordNotification(message) {
  if (!WEBHOOK_URL) {
    console.warn('Discord Webhook URL is missing!');
    return;
  }

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
      // CRITICAL: keepalive ensures the request fires even if the tab is closed immediately
      keepalive: true, 
    });
  } catch (err) {
    console.error('Notification failed', err);
  }
}

export function useVisitorTracking() {
  const hasFiredEnter = useRef(false);

  useEffect(() => {
    // Prevents double-firing in React StrictMode during development
    if (!hasFiredEnter.current) {
      sendDiscordNotification(`🟢 **New Visitor!**`);
      hasFiredEnter.current = true;
    }

    const handleLeave = () => {
      sendDiscordNotification(`🔴 **Visitor Left**`);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleLeave();
      }
    };

    window.addEventListener('beforeunload', handleLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup both listeners properly
    return () => {
      window.removeEventListener('beforeunload', handleLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}