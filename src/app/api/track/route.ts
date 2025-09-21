import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { insertEvent } from "@/lib/clickhouse";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Body:", body);

    // Insert event to ClickHouse with all tracking data
    const event = {
      session_id: body.sessionId || randomUUID(),
      timestamp: new Date(),
      referrer: body.referrer || "",
      href: body.href || "",
      user_agent: body.userAgent || "",
      screen: body.screen || "",
      language: body.language || "",
    };

    const result = await insertEvent(event);

    if (result.success) {
      console.log("Event inserted to ClickHouse:", event);
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
