import type { Metadata } from "next";
import CreateOrganizationForm from "@/components/organization/create-organization-form";

export const metadata: Metadata = {
  title: `New Organization`,
};

export default function NewOrganizationPage() {
  return <CreateOrganizationForm />;
}
