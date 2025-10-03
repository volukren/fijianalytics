import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { clickhouse } from "@/lib/clickhouse";

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

    const events = await clickhouse.query(domain);

    const uniqueSessions = new Set(events.map((e) => e.session_id)).size;
    const pageViews = events.length;

    const pageViewCounts = events.reduce(
      (acc, event) => {
        acc[event.pathname] = (acc[event.pathname] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const topPages = Object.entries(pageViewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([pathname, views]) => ({ href: pathname, views }));

    const referrerCounts = events.reduce(
      (acc, event) => {
        if (event.referrer) {
          acc[event.referrer] = (acc[event.referrer] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const referrers = Object.entries(referrerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }));

    const browserCounts = events.reduce(
      (acc, event) => {
        if (event.browser) {
          acc[event.browser] = (acc[event.browser] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const browsers = Object.entries(browserCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([browser, count]) => ({ browser, count }));

    console.log("Browser counts:", browserCounts);
    console.log("Browsers array:", browsers);

    const osCounts = events.reduce(
      (acc, event) => {
        if (event.os) {
          acc[event.os] = (acc[event.os] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const operatingSystems = Object.entries(osCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([os, count]) => ({ os, count }));

    // Group events by hour
    const hourlyVisitors = events.reduce(
      (acc, event) => {
        const date = new Date(event.timestamp);
        const hour = date.getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    // Create array with all 24 hours
    const visitorsByHour = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      visitors: hourlyVisitors[hour] || 0,
    }));

    return NextResponse.json({
      pageViews,
      uniqueSessions,
      topPages,
      referrers,
      browsers,
      operatingSystems,
      visitorsByHour,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
