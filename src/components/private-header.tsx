"use client";

import Link from "next/link";
import type { Organization } from "@/generated/client";
import LogoSVG from "./logo";
import { ProfileDropdown } from "./profile-dropdown";

interface PrivateHeaderProps {
  organizations: Organization[];
}

export default function PrivateHeader({ organizations }: PrivateHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <Link href="/organizations" className="flex items-center gap-2">
        <LogoSVG />
        <span className="text-lg text-gray-700 font-semibold tracking-tight">
          Fiji Analytics
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <ProfileDropdown />
      </div>
    </header>
  );
}
