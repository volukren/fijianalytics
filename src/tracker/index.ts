import type { TrackingData } from "./types.js";
import { debounce } from "./utils.js";
import { send } from "./networking.js";

((window) => {
  const {
    document: { currentScript, referrer },
    navigator: { userAgent },
  } = window;

  if (!currentScript) {
    console.error("Could not find current script");
    return;
  }

  const scriptSrc = (currentScript as HTMLScriptElement).src;
  const url = new URL(scriptSrc);
  const apiHost = `${url.protocol}//${url.host}`;

  const domain = (currentScript as HTMLScriptElement).getAttribute(
    "data-domain",
  );

  if (!domain) {
    console.error("Missing data-domain attribute on script tag");
    return;
  }

  console.info("api host: ", apiHost);
  console.info("tracking domain: ", domain);

  const debouncedSend = debounce(
    (data: TrackingData) => send(data, apiHost),
    300,
  );

  const track = () => {
    const trackingData: TrackingData = {
      domain,
      referrer,
      href: window.location.pathname,
      userAgent,
      screen: `${window.screen.width}x${window.screen.height}`,
      language:
        window.navigator.language || window.navigator.languages?.[0] || "",
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
