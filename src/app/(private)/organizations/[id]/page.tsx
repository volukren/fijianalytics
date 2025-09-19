import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

interface OrganizationPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrganizationPage({
  params,
}: OrganizationPageProps) {
  const { id } = await params;

  const organization = await prisma.organization.findFirst({
    where: { id },
  });
  if (!organization) {
    notFound();
  }

  const websites = await prisma.website.findMany({
    where: { organizationId: id },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl tracking-tight">Your Websites</h1>
        <Button asChild size="sm">
          <Link href={`/organizations/${id}/new-website`}>
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
