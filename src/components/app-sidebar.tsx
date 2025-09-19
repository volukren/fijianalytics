"use client";

import { ChevronDownIcon, Loader2Icon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import OrganizationSwitcher from "@/components/organization/organization-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth/client";

export default function AppSidebar() {
  const { data: session } = authClient.useSession();
  const { data: organizations, isPending: isListPending } =
    authClient.useListOrganizations();
  const { data: activeOrganization, isPending: isActivePending } =
    authClient.useActiveOrganization();

  const isMobile = useSidebar();

  const router = useRouter();

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

      const nextOrg = orgs.find((org) => org.id === organizationId);
      toast.success(
        nextOrg ? `Switched to ${nextOrg.name}` : "Active organization updated",
      );
    } catch (error) {
      toast.error("Unable to switch organization");
    }
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="gap-y-6">
        <div className="text-black text-xl font-bold tracking-tight">
          <div className="hidden group-data-[collapsible=icon]:flex">
            <Link
              href="/organizations"
              className="flex items-center mx-auto gap-2"
            >
              FJ
            </Link>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <Link href="/organizations" className="flex items-center gap-2">
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
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="w-8 h-8 rounded-lg">
                    <AvatarImage
                      src={session?.user?.image || ""}
                      alt={session?.user?.name || ""}
                    />
                    <AvatarFallback className="rounded-lg">
                      {session?.user?.name?.charAt(0) ||
                        session?.user?.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session?.user?.name || ""}
                    </span>
                    <span className="truncate text-xs">
                      {session?.user?.email || ""}
                    </span>
                  </div>
                  <ChevronDownIcon className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side={isMobile ? "bottom" : "right"}
              >
                <DropdownMenuLabel>
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={session?.user?.image || ""}
                        alt={session?.user?.name || ""}
                      />
                      <AvatarFallback className="rounded-lg">
                        {session?.user?.name?.charAt(0) ||
                          session?.user?.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {session?.user?.name || ""}
                      </span>
                      <span className="truncate text-xs">
                        {session?.user?.email || ""}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await authClient.signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          router.push("/");
                        },
                      },
                    });
                  }}
                >
                  <LogOutIcon />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
