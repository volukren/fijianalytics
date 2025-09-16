import { PlusIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth/server";

export default async function OrganizationsPage() {
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  const sortedOrganizations = [...organizations].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl tracking-tight">
          Your Organizations
        </h1>
        <Button asChild size="sm">
          <Link href="/organizations/new">
            <PlusIcon size={15} />
            New Organization
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-5">
        {sortedOrganizations.map((o) => (
          <Card key={o.id} className="shadow-none relative hover:shadow-xs">
            <CardHeader>
              <CardTitle>
                <Link href={`/organizations/${o.id}`}>
                  {o.name}
                  <span className="absolute inset-0"></span>
                </Link>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
