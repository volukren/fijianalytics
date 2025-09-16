import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

interface WebsitePageProps {
  params: Promise<{ domain: string }>;
}

export default async function WebsitePage({ params }: WebsitePageProps) {
  const { domain } = await params;

  const [session, website] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    prisma.website.findFirst({ where: { domain } }),
  ]);

  if (!website) {
    return <div>This page is forbidden</div>;
  }

  if (!website.public) {
    if (!session) {
      return <div>This page is forbidden</div>;
    }
    const member = await prisma.member.findFirst({
      where: {
        organizationId: website.organizationId,
        userId: session.user.id,
      },
    });
    if (!member) {
      return <div>This page is forbidden</div>;
    }
  }

  return <div>{website.domain}</div>;
}
