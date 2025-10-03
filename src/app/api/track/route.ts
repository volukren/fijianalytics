import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isbot } from "isbot";
import { UAParser } from "ua-parser-js";
import { clickhouse } from "@/lib/clickhouse";
import upsertSession from "@/lib/session";
import generateVisitorId from "@/lib/visitor-id";

function getClientIP(request: NextRequest): string {
  // Get IP address from various headers (in order of preference)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  // x-forwarded-for may contain multiple IPs, take the first one
  const ip = forwardedFor?.split(",")[0].trim() || realIP || cfConnectingIP || "unknown";

  // Log IP detection details for debugging
  console.log("User IP address:", ip);
  console.log("Headers for IP detection:", {
    "x-forwarded-for": forwardedFor,
    "x-real-ip": realIP,
    "cf-connecting-ip": cfConnectingIP,
  });

  return ip;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const ip = getClientIP(request);

    const userAgent = request.headers.get("user-agent") || "";

    if (isbot(userAgent)) {
      return NextResponse.json({
        success: true,
        message: "Event not tracked: request from bot detected",
      });
    }

    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();

    const screenParts = body.screen?.split("x") || ["0", "0"];
    const screenWidth = parseInt(screenParts[0], 10) || 0;
    const screenHeight = parseInt(screenParts[1], 10) || 0;

    const visitorId = await generateVisitorId(ip, userAgent);
    const sessionId = await upsertSession(visitorId, body.domain);

    const event = {
      event_id: randomUUID().toString(),
      timestamp: Date.now(),
      session_id: sessionId,
      pathname: body.href,
      event_type: "pageview",
      referrer: body.referrer || "",
      language: body.language || "",
      site_id: body.domain,
      screen_width: screenWidth,
      screen_height: screenHeight,
      browser: browser.name || "",
      browser_version: browser.version || "",
      os: os.name || "",
      visitor_id: visitorId,
    };

    console.info("Event info:", event);

    await clickhouse.insert(event);

    return NextResponse.json({
      success: true,
      message: "Data tracked successfully",
      timestamp: event.timestamp,
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
