-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Configure cron job to run every 10 seconds
-- Delete active_sessions records where endedAt is older than 30 minutes
SELECT cron.schedule(
    'cleanup-ended-sessions',
    '*/10 * * * * *', -- Every 10 seconds
    $$DELETE FROM active_sessions WHERE "endedAt" IS NOT NULL AND "endedAt" <= NOW() - INTERVAL '30 minutes'$$
);
