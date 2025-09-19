"use client";

import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import NavUser from "@/components/nav-user";
import OrganizationSwitcher from "@/components/organization/organization-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth/client";

export default function AppSidebar() {
  const router = useRouter();
  const { data: organizations, isPending: isListPending } =
    authClient.useListOrganizations();
  const { data: activeOrganization, isPending: isActivePending } =
    authClient.useActiveOrganization();

  const isLoading = isListPending || isActivePending;
  const orgs = organizations ?? [];

  const handleOrganizationSwitch = async (organizationId: string) => {
    try {
      const { error } = await authClient.organization.setActive({
        organizationId,
      });

      if (error) {
        toast.error(error.message ?? "Unable to switch organization");
        return;
      }

      router.push('/dashboard');

      const nextOrg = orgs.find((org) => org.id === organizationId);
      toast.success(
        nextOrg ? `Switched to ${nextOrg.name}` : "Active organization updated",
      );
    } catch (_error) {
      toast.error("Unable to switch organization");
    }
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="gap-y-6">
        <div className="text-black text-xl font-bold tracking-tight">
          <div className="hidden group-data-[collapsible=icon]:flex">
            <Link href="/dashboard" className="flex items-center mx-auto gap-2">
              FJ
            </Link>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <Link href="/dashboard" className="flex items-center gap-2">
              Fiji Analytics
            </Link>
          </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-sidebar-border/60">
            <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <OrganizationSwitcher
            organizations={orgs}
            activeOrganization={activeOrganization ?? null}
            onSwitch={handleOrganizationSwitch}
          />
        )}
      </SidebarHeader>
      <SidebarContent></SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
