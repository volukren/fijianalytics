import { createClient, type ClickHouseClient } from "@clickhouse/client";

export interface AnalyticsEvent {
	event_id: string;
	timestamp: number;
	session_id: string;
	pathname: string;
	event_type: string;
	referrer: string;
	language: string;
	site_id: string;
	screen_width: number;
	screen_height: number;
	browser: string;
	browser_version: string;
	os: string;
	visitor_id: string;
}

class ClickHouseService {
	private client: ClickHouseClient;
	private buffer: AnalyticsEvent[] = [];
	private timer: NodeJS.Timeout | null = null;
	private readonly bufferSize = 5000;
	private readonly flushInterval = 10000; // 10 seconds

	constructor() {
		this.client = createClient({
			host: process.env.CLICKHOUSE_HOST!,
			database: process.env.CLICKHOUSE_DB!,
			username: process.env.CLICKHOUSE_USER!,
			password: process.env.CLICKHOUSE_PASSWORD!,
		});
	}

	async insert(event: AnalyticsEvent): Promise<void> {
		this.buffer.push(event);

		if (this.buffer.length >= this.bufferSize) {
			await this.flush();
		} else if (!this.timer) {
			this.timer = setTimeout(() => this.flush(), this.flushInterval);
		}
	}

	async query(siteId: string): Promise<AnalyticsEvent[]> {
		const resultSet = await this.client.query({
			query: "SELECT * FROM events WHERE site_id = {siteId: String}",
			query_params: { siteId },
			format: "JSONEachRow",
		});

		return await resultSet.json<AnalyticsEvent>();
	}

	async flush(): Promise<void> {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}

		if (this.buffer.length === 0) return;

		const events = [...this.buffer];
		this.buffer = [];

		try {
			await this.client.insert({
				table: "events",
				values: events,
				format: "JSONEachRow",
			});
		} catch (error) {
			console.error("ClickHouse insert error:", error);
			this.buffer.unshift(...events);
		}
	}
}

export const clickhouse = new ClickHouseService();
