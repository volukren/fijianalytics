"use client";

import type { Organization } from "better-auth/plugins/organization";
import { ChevronDownIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface OrganizationSwitcherProps {
  organizations: Organization[];
  activeOrganization: Organization | null;
  onSwitch: (organizationId: string) => void;
}

export default function OrganizationSwitcher({
  organizations,
  activeOrganization,
  onSwitch,
}: OrganizationSwitcherProps) {
  const { state } = useSidebar();

  const isCollapsed = state === "collapsed";

  return (
    <DropdownMenu>
      <SidebarMenu className="w-full">
        <SidebarMenuItem>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="border border-neutral-200">
              <Avatar className="size-8 rounded">
                <AvatarFallback className="rounded bg-neutral-200">
                  {activeOrganization?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="flex-1 truncate text-sm">
                    {activeOrganization?.name || "Switch Organization"}
                  </div>
                  <ChevronDownIcon className="size-4 text-muted-foreground" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </SidebarMenuItem>
      </SidebarMenu>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Organizations
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={activeOrganization?.id ?? ""}
          onValueChange={(orgId) => onSwitch(orgId)}
        >
          {organizations.map((org) => (
            <DropdownMenuRadioItem
              key={org.id}
              value={org.id}
              className="truncate"
            >
              {org.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
