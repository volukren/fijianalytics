import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { getAnalyticsByDomain } from "@/lib/clickhouse";

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

  const analytics = await getAnalyticsByDomain(domain);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{website.domain}</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-600">Page Views</div>
          <div className="text-2xl font-bold">{analytics.pageViews}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-600">Unique Sessions</div>
          <div className="text-2xl font-bold">{analytics.uniqueSessions}</div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Top Pages</h2>
        <div className="space-y-2">
          {analytics.topPages.length > 0 ? (
            analytics.topPages.map((page) => (
              <div key={page.href} className="flex justify-between">
                <div className="text-sm truncate max-w-md">{page.href}</div>
                <div className="text-sm font-medium">{page.views}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No data yet</div>
          )}
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Top Referrers</h2>
        <div className="space-y-2">
          {analytics.referrers.length > 0 ? (
            analytics.referrers.map((referrer) => (
              <div key={referrer.referrer} className="flex justify-between">
                <div className="text-sm truncate max-w-md">{referrer.referrer || "Direct"}</div>
                <div className="text-sm font-medium">{referrer.count}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No data yet</div>
          )}
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">Installation</h2>
        <p className="text-sm text-gray-600 mb-2">Add this script to your website:</p>
        <code className="block p-2 bg-white rounded text-xs">
          {`<script data-domain="${domain}" src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/script.js"></script>`}
        </code>
      </div>
    </div>
  );
}