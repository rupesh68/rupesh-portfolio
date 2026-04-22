// // // import { useEffect, useRef } from 'react';

// // // const WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK;

// // // async function sendDiscordNotification(message) {
// // //   try {
// // //     await fetch(WEBHOOK_URL, {
// // //       method: 'POST',
// // //       headers: { 'Content-Type': 'application/json' },
// // //       body: JSON.stringify({ content: message }),
// // //     });
// // //   } catch (err) {
// // //     console.error('Notification failed', err);
// // //   }
// // // }

// // // export function useVisitorTracking() {
// // //   const startTime = useRef(null);

// // //   useEffect(() => {
// // //     console.log('Webhook URL:', import.meta.env.VITE_DISCORD_WEBHOOK);
// // //     console.log('Tracking started...');

// // //     startTime.current = Date.now();

// // //     sendDiscordNotification(`🟢 **New Visitor!**`);

// // //     const handleLeave = () => {
// // //       sendDiscordNotification(`🔴 **Visitor Left**`);
// // //     };

// // //     window.addEventListener('beforeunload', handleLeave);
// // //     document.addEventListener('visibilitychange', () => {
// // //       if (document.visibilityState === 'hidden') handleLeave();
// // //     });

// // //     return () => {
// // //       window.removeEventListener('beforeunload', handleLeave);
// // //     };
// // //   }, []);
// // // }
// // import { useEffect, useRef } from 'react';

// // const WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK;

// // async function sendDiscordNotification(message) {
// //   if (!WEBHOOK_URL) {
// //     console.warn('Discord Webhook URL is missing!');
// //     return;
// //   }

// //   try {
// //     await fetch(WEBHOOK_URL, {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({ content: message }),
// //       // CRITICAL: keepalive ensures the request fires even if the tab is closed immediately
// //       keepalive: true, 
// //     });
// //   } catch (err) {
// //     console.error('Notification failed', err);
// //   }
// // }

// // export function useVisitorTracking() {
// //   const hasFiredEnter = useRef(false);

// //   useEffect(() => {
// //     // Prevents double-firing in React StrictMode during development
// //     if (!hasFiredEnter.current) {
// //       sendDiscordNotification(`🟢 **New Visitor!**`);
// //       hasFiredEnter.current = true;
// //     }

// //     const handleLeave = () => {
// //       sendDiscordNotification(`🔴 **Visitor Left**`);
// //     };

// //     const handleVisibilityChange = () => {
// //       if (document.visibilityState === 'hidden') {
// //         handleLeave();
// //       }
// //     };

// //     window.addEventListener('beforeunload', handleLeave);
// //     document.addEventListener('visibilitychange', handleVisibilityChange);

// //     // Cleanup both listeners properly
// //     return () => {
// //       window.removeEventListener('beforeunload', handleLeave);
// //       document.removeEventListener('visibilitychange', handleVisibilityChange);
// //     };
// //   }, []);
// // }

// import { useEffect, useRef } from 'react';

// async function sendDiscordNotification(message) {
//   try {
//     await fetch('/api/notify', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ message }),
//       keepalive: true, 
//     });
//   } catch (err) {
//     console.error('Notification failed', err);
//   }
// }

// export function useVisitorTracking() {
//   const hasFiredEnter = useRef(false);

//   useEffect(() => {
//     if (!hasFiredEnter.current) {
//       sendDiscordNotification(`🟢 **New Visitor!**`);
//       hasFiredEnter.current = true;
//     }

//     const handleLeave = () => {
//       sendDiscordNotification(`🔴 **Visitor Left**`);
//     };

//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'hidden') handleLeave();
//     };

//     window.addEventListener('beforeunload', handleLeave);
//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     return () => {
//       window.removeEventListener('beforeunload', handleLeave);
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, []);
// }
// import { useEffect, useRef } from 'react';

// async function sendDiscordNotification(message) {
//   try {
//     await fetch('/api/notify', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ message }),
//       keepalive: true, 
//     });
//   } catch (err) {
//     console.error('Notification failed', err);
//   }
// }

// export function useVisitorTracking() {
//   const hasFiredEnter = useRef(false);

//   useEffect(() => {
//     // Capture the current time
//     const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

//     if (!hasFiredEnter.current) {
//       sendDiscordNotification(`🟢 **New Visitor!**\n📅 **Time:** ${timestamp}`);
//       hasFiredEnter.current = true;
//     }

//     const handleLeave = () => {
//       const leaveTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
//       sendDiscordNotification(`🔴 **Visitor Left**\n📅 **Time:** ${leaveTime}`);
//     };

//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'hidden') handleLeave();
//     };

//     window.addEventListener('beforeunload', handleLeave);
//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     return () => {
//       window.removeEventListener('beforeunload', handleLeave);
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, []);
// }
import { useEffect, useRef } from 'react';

async function sendDiscordNotification(message) {
  try {
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
  const visitorIp = useRef('Unknown IP'); // Store the IP to use when leaving

  useEffect(() => {
    // 1. Define an async function to get the IP and send the initial ping
    // const initTracking = async () => {
    //   if (hasFiredEnter.current) return;
    //   hasFiredEnter.current = true;

    //   const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      
    //   try {
    //     // Fetch the IP address from a free service
    //     const ipResponse = await fetch('https://api.ipify.org?format=json');
    //     const ipData = await ipResponse.json();
    //     visitorIp.current = ipData.ip;
    //   } catch (err) {
    //     console.warn('Could not fetch IP', err);
    //   }

    //   sendDiscordNotification(`🟢 **New Visitor!**\n📅 **Time:** ${timestamp}\n🌐 **IP:** ${visitorIp.current}`);
    // };









// Inside your useEffect
const initTracking = async () => {
  if (hasFiredEnter.current) return;
  hasFiredEnter.current = true;

  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  let locationData = 'Unknown Location';
  
  try {
    // ipapi.co gives you IP, city, country, and even the ISP/Company network!
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    locationData = `${data.city}, ${data.country_name} (IP: ${data.ip})`;
    visitorIp.current = locationData; // Save it for the "leave" notification
  } catch (err) {
    console.warn('Could not fetch location', err);
  }

  sendDiscordNotification(`🟢 **New Portfolio Visitor!**\n📅 **Time:** ${timestamp}\n📍 **Location:** ${locationData}`);
};




    initTracking();

    // 2. Handle leaving
    const handleLeave = () => {
      const leaveTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      sendDiscordNotification(`🔴 **Visitor Left**\n📅 **Time:** ${leaveTime}\n🌐 **IP:** ${visitorIp.current}`);
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