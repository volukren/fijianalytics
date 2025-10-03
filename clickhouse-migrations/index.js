import { createClient } from '@clickhouse/client';

const client = createClient({
  host: process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DB || 'fiji',
  username: process.env.CLICKHOUSE_USER || 'user',
  password: process.env.CLICKHOUSE_PASSWORD || 'password',
});

async function createEventsTable() {
  console.log('Creating events table...');

  await client.command({
    query: `
      CREATE TABLE IF NOT EXISTS events (
        event_id String,
        timestamp DateTime,
        session_id String,
        pathname String,
        screen_width UInt16,
        screen_height UInt16,
        event_type String,
        referrer String,
        language String,
        site_id String,
        browser String,
        browser_version String,
        os String
      )
      ENGINE = MergeTree()
      PARTITION BY toYYYYMM(timestamp)
      ORDER BY (timestamp, event_id)
    `,
  });

  console.log('Events table created successfully');
}

async function addMissingColumns() {
  console.log('Adding missing columns...');

  try {
    await client.command({
      query: `
        ALTER TABLE events
        ADD COLUMN IF NOT EXISTS browser String DEFAULT ''
      `,
    });

    await client.command({
      query: `
        ALTER TABLE events
        ADD COLUMN IF NOT EXISTS browser_version String DEFAULT ''
      `,
    });

    await client.command({
      query: `
        ALTER TABLE events
        ADD COLUMN IF NOT EXISTS os String DEFAULT ''
      `,
    });

    await client.command({
      query: `
        ALTER TABLE events
        ADD COLUMN IF NOT EXISTS visitor_id String DEFAULT ''
      `,
    });

    console.log('Missing columns added successfully');
  } catch (error) {
    console.error('Error adding columns:', error);
  }
}

async function createIndexes() {
  console.log('Creating indexes...');

  // Add index for session_id for faster session queries
  await client.command({
    query: `
      ALTER TABLE events
      ADD INDEX IF NOT EXISTS idx_session_id session_id TYPE bloom_filter GRANULARITY 1
    `,
  });

  // Add index for site_id for faster site filtering
  await client.command({
    query: `
      ALTER TABLE events
      ADD INDEX IF NOT EXISTS idx_site_id site_id TYPE bloom_filter GRANULARITY 1
    `,
  });

  console.log('Indexes created successfully');
}

async function runMigrations() {
  try {
    console.log('Starting ClickHouse migrations...');
    console.log(`Database: ${process.env.CLICKHOUSE_DB || 'fiji'}`);
    console.log(`Host: ${process.env.CLICKHOUSE_HOST || 'http://localhost:8123'}`);

    await createEventsTable();
    await addMissingColumns();
    await createIndexes();

    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

runMigrations();
