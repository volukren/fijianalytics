"use client";

import Link from "next/link";
import { ProfileDropdown } from "./profile-dropdown";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="h-16 flex items-center justify-center gap-2 text-black font-bold text-2xl">
        <div className="hidden group-data-[collapsible=icon]:flex">
          <Link href="/organizations" className="flex items-center gap-2">
            FJ
          </Link>
        </div>
        <div className="group-data-[collapsible=icon]:hidden">
          <Link href="/organizations" className="flex items-center gap-2">
            Fiji Analytics
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent></SidebarContent>
      <SidebarFooter>
        <ProfileDropdown />
      </SidebarFooter>
    </Sidebar>
  );
}
