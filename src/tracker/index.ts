import type { TrackingData } from "./types.js";
import { debounce } from "./utils.js";

((window) => {
  const {
    document: { currentScript, referrer },
    navigator: { userAgent },
  } = window;

  if (!currentScript) {
    console.error("Could not find current script");
    return;
  }

  const send = async (data: TrackingData) => {
    await fetch("http://localhost:3000/api/track", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const debouncedSend = debounce((data: TrackingData) => send(data), 300);

  const track = () => {
    const trackingData: TrackingData = {
      referrer,
      href: window.location.href,
      userAgent,
    };
    debouncedSend(trackingData);
  };

  track();

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = (...args) => {
    originalPushState.apply(history, args);
    track();
  };

  history.replaceState = (...args) => {
    originalReplaceState.apply(history, args);
    track();
  };

  window.addEventListener("popstate", track);
})(window);
