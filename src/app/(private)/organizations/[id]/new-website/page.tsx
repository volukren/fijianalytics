import CreateWebsiteForm from "@/components/website/create-website-form";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface NewWebsitePageProps {
  params: Promise<{ id: string }>;
}

export default async function NewWebsitePage({ params }: NewWebsitePageProps) {
  const { id } = await params;

  const organization = await prisma.organization.findFirst({ where: { id } });
  if (!organization) {
    notFound();
  }

  return <CreateWebsiteForm organizationId={id} />;
}
