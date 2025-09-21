import type { TrackingData } from "./types.js";

export const send = async (
  data: TrackingData,
  apiHost: string,
): Promise<void> => {
  await fetch(`${apiHost}/api/track`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
