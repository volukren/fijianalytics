import type { Metadata } from "next";
import CreateOrganizationForm from "@/components/organization/create-organization-form";

export const metadata: Metadata = {
  title: "Create your first organization",
};

export default function CreateOrganizationPage() {
  return (
    <>
      <div className="text-center space-y-5">
        <h1 className="font-bold text-2xl">Create your organization</h1>
        <p className="text-balance text-neutral-500">
          Set up a shared space to manage your websites analytics with your team
        </p>
      </div>
      <CreateOrganizationForm />
    </>
  );
}
