import type { Metadata } from "next";
import { headers } from "next/headers";
import DeleteAccountForm from "@/components/settings/delete-account-form";
import EditNameForm from "@/components/settings/edit-name-form";
import { auth } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: `Settings - Fiji Analytics`,
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="space-y-2 mb-8">
        <h1 className="font-bold text-2xl">User account</h1>
        <p className="tracking-wide text-neutral-500">Manage your profile</p>
      </div>

      <div className="space-y-6">
        <EditNameForm currentName={session.user.name || ""} />
        <DeleteAccountForm />
      </div>
    </div>
  );
}
