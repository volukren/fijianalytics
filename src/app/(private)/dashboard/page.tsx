import { PlusIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.session.activeOrganizationId) {
    return <div>No active organization found</div>;
  }

  const websites = await prisma.website.findMany({
    where: { organizationId: session.session.activeOrganizationId },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl tracking-tight">Your Websites</h1>
        <Button asChild size="sm">
          <Link
            href={`/organizations/${session.session.activeOrganizationId}/new-website`}
          >
            <PlusIcon size={15} />
            New Website
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 py-10">
        {websites.map((w) => {
          return (
            <div
              key={w.id}
              className="p-5 rounded-lg border border-gray-200 relative hover:shadow-xs"
            >
              <Link href={`/websites/${w.domain}`}>
                {w.domain}
                <span className="absolute inset-0"></span>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
