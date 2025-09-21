import { createClient } from "@clickhouse/client";

export const clickhouseClient = createClient({
  url: process.env.CLICKHOUSE_HOST as string,
  database: process.env.CLICKHOUSE_DB as string,
  username: process.env.CLICKHOUSE_USER as string,
  password: process.env.CLICKHOUSE_PASSWORD as string,
  request_timeout: 30000,
});

export interface EventRecord {
  session_id: string;
  timestamp: Date | string;
  referrer: string;
  href: string;
  user_agent: string;
  screen: string;
  language: string;
}

export async function insertEvent(event: EventRecord) {
  try {
    // Format timestamp for ClickHouse DateTime format (YYYY-MM-DD HH:MM:SS)
    const timestamp =
      typeof event.timestamp === "string"
        ? new Date(event.timestamp)
        : event.timestamp;

    const formattedTimestamp = timestamp
      .toISOString()
      .replace("T", " ")
      .replace(/\.\d{3}Z$/, "");

    const eventToInsert = {
      session_id: event.session_id,
      timestamp: formattedTimestamp,
      referrer: event.referrer,
      href: event.href,
      user_agent: event.user_agent,
      screen: event.screen,
      language: event.language,
    };

    await clickhouseClient.insert({
      table: "events",
      values: [eventToInsert],
      format: "JSONEachRow",
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to insert event to ClickHouse:", error);
    return { success: false, error };
  }
}

export async function getEvents(limit = 100) {
  try {
    const query = `SELECT * FROM events ORDER BY timestamp DESC LIMIT {limit:UInt32}`;

    const result = await clickhouseClient.query({
      query,
      query_params: { limit },
      format: "JSONEachRow",
    });

    const data = await result.json<EventRecord[]>();
    return data;
  } catch (error) {
    console.error("Failed to fetch events from ClickHouse:", error);
    return [];
  }
}

export async function testConnection() {
  try {
    const result = await clickhouseClient.query({
      query: "SELECT 1",
    });
    await result.json();
    return true;
  } catch (error) {
    console.error("ClickHouse connection test failed:", error);
    return false;
  }
}
