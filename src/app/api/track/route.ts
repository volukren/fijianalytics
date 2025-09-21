import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { insertEvent } from "@/lib/clickhouse";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Body:", body);

    // Insert test event to ClickHouse
    const testEvent = {
      session_id: body.sessionId || randomUUID(),
      timestamp: new Date(),
    };

    const result = await insertEvent(testEvent);

    if (result.success) {
      console.log("Event inserted to ClickHouse:", testEvent);
    } else {
      console.error("Failed to insert event to ClickHouse");
    }

    return NextResponse.json({
      success: true,
      message: "Data tracked successfully",
      timestamp: new Date().toISOString(),
      clickhouse: result.success
        ? "Event saved to ClickHouse"
        : "Failed to save to ClickHouse",
    });
  } catch (error) {
    console.error("Error processing track request:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process tracking queries",
      },
      { status: 400 },
    );
  }
}
