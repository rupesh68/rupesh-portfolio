import { useEffect, useRef } from "react";

const WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK;

async function sendDiscordNotification(message) {
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });
  } catch (err) {
    console.error("Notification failed", err);
  }
}

function getVisitorInfo() {
  return {
    page: window.location.pathname,
    referrer: document.referrer || "Direct",
    device: /Mobi|Android/i.test(navigator.userAgent) ? "📱 Mobile" : "🖥️ Desktop",
    time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  };
}

export function useVisitorTracking() {
//   const startTime = useRef(Date.now());

  const startTime = useRef(null); // ✅ null instead of Date.now()

  useEffect(() => {




 startTime.current = Date.now(); // ✅ set here, inside effect


    const info = getVisitorInfo();

    // 🔔 Notify on arrival
    sendDiscordNotification(
      `🟢 **New Visitor!**\n` +
      `📄 Page: \`${info.page}\`\n` +
      `🔗 Referrer: ${info.referrer}\n` +
      `${info.device}\n` +
      `🕐 Time: ${info.time}`
    );

    // ⏱️ Track time spent on leave
    const handleLeave = () => {
      const seconds = Math.round((Date.now() - startTime.current) / 1000);
      const duration =
        seconds < 60
          ? `${seconds}s`
          : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;

      sendDiscordNotification(
        `🔴 **Visitor Left**\n` +
        `📄 Page: \`${info.page}\`\n` +
        `⏱️ Time Spent: **${duration}**`
      );
    };

    window.addEventListener("beforeunload", handleLeave);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") handleLeave();
    });

    return () => {
      window.removeEventListener("beforeunload", handleLeave);
    };
  }, []);
}