import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET(
  request: Request,
  props: { params: Promise<{ domain: string }> },
) {
  const { domain } = await props.params;

  try {
    const website = await prisma.website.findFirst({
      where: { domain },
    });

    if (!website) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (!website.public) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      const member = await prisma.member.findFirst({
        where: {
          organizationId: website.organizationId,
          userId: session.user.id,
        },
      });

      if (!member) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    }

    // Call Tinybird API endpoint - filtering by site_id (which is the domain)
    const tinybirdResponse = await fetch(
      `https://api.tinybird.co/v0/pipes/get_events.json?site_id=${encodeURIComponent(domain)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TINYBIRD_READ_TOKEN}`,
        },
      },
    );

    if (!tinybirdResponse.ok) {
      throw new Error(`Tinybird API error: ${tinybirdResponse.status}`);
    }

    const tinybirdData = await tinybirdResponse.json();

    // Process raw events into analytics format expected by the frontend
    const events = tinybirdData.data || [];

    // Calculate metrics
    const pageViews = events.length;
    const uniqueSessions = new Set(events.map((e: any) => e.session_id)).size;

    // Calculate top pages
    const pageCount = new Map<string, number>();
    events.forEach((event: any) => {
      if (event.pathname) {
        pageCount.set(event.pathname, (pageCount.get(event.pathname) || 0) + 1);
      }
    });

    const topPages = Array.from(pageCount.entries())
      .map(([href, views]) => ({ href, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Calculate top referrers
    const referrerCount = new Map<string, number>();
    events.forEach((event: any) => {
      const referrer = event.referrer || "";
      referrerCount.set(referrer, (referrerCount.get(referrer) || 0) + 1);
    });

    const referrers = Array.from(referrerCount.entries())
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const analytics = {
      pageViews,
      uniqueSessions,
      topPages,
      referrers,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
