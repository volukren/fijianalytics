import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Body:", body);

    return NextResponse.json({
      success: true,
      message: "Data tracked successfully",
      timestamp: new Date().toISOString(),
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
