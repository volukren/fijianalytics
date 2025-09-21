import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { getAnalyticsByDomain } from "@/lib/clickhouse";
import { headers } from "next/headers";

export async function GET(
  request: Request,
  props: { params: Promise<{ domain: string }> }
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

    const analytics = await getAnalyticsByDomain(domain);

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
