import { createClient } from "@clickhouse/client";

console.log("Connecting to ClickHouse:");
console.log("URL:", process.env.CLICKHOUSE_HOST);
console.log("Database:", process.env.CLICKHOUSE_DB);
console.log("User:", process.env.CLICKHOUSE_USER);

const clickhouse = createClient({
  url: process.env.CLICKHOUSE_HOST,
  database: process.env.CLICKHOUSE_DB,
  username: process.env.CLICKHOUSE_USER,
  password: process.env.CLICKHOUSE_PASSWORD,
  clickhouse_settings: {
    use_client_time_zone: true,
  },
  request_timeout: 30000,
});

async function migrate() {
  console.log("Starting migration...");
  try {
    // Create the table
    await clickhouse.exec({
      query: `
        CREATE TABLE IF NOT EXISTS events
        (
          session_id String,
          timestamp DateTime
        )
        ENGINE = MergeTree()
        ORDER BY timestamp
      `,
    });
    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

// Wait a bit for ClickHouse to be fully ready
setTimeout(() => {
  migrate();
}, 5000);
