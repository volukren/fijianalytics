import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Body:", body);

    // Extract screen dimensions from the screen string (e.g., "1920x1080")
    const screenParts = body.screen?.split("x") || ["0", "0"];
    const screenWidth = parseInt(screenParts[0], 10) || 0;
    const screenHeight = parseInt(screenParts[1], 10) || 0;

    const event = {
      event_id: randomUUID().toString(),
      timestamp: Date.now(),
      session_id: body.sessionId || randomUUID().toString(),
      pathname: body.href,
      event_type: "pageview",
      referrer: body.referrer || "",
      language: body.language || "",
      site_id: body.domain,
      screen_width: screenWidth,
      screen_height: screenHeight,
    };

    console.info("Event info:", event);

    const tinyBirdResponse = await fetch(
      `https://api.eu-central-1.aws.tinybird.co/v0/events?name=events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      },
    );

    if (!tinyBirdResponse.ok) {
      const errorText = await tinyBirdResponse.text();
      console.error("Tinybird API error:", {
        status: tinyBirdResponse.status,
        statusText: tinyBirdResponse.statusText,
        error: errorText,
      });
    }

    const tinyBirdData = await tinyBirdResponse.json();
    console.info("Tinybird response:", tinyBirdData);

    return NextResponse.json({
      success: true,
      message: "Data tracked successfully",
      timestamp: event.timestamp,
      tinybird: tinyBirdData,
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
