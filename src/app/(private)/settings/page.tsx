import type { Metadata } from "next";
import { headers } from "next/headers";
import EditOrganizationNameForm from "@/components/settings/edit-organization-name-form";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: `Organization Settings - Fiji Analytics`,
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.session.activeOrganizationId) {
    return <div>No active organization found</div>;
  }

  const organization = await prisma.organization.findUnique({
    where: { id: session.session.activeOrganizationId },
  });

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="space-y-2 mb-8">
        <h1 className="font-bold text-2xl">Organization Settings</h1>
        <p className="tracking-wide text-neutral-500">
          Manage your organization settings
        </p>
      </div>

      <div className="space-y-6">
        <EditOrganizationNameForm
          currentName={organization.name}
          organizationId={organization.id}
        />
      </div>
    </div>
  );
}