"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import LogoSVG from "./logo";
import { Button } from "./ui/button";

export default function Header() {
  const { data: session } = authClient.useSession();

  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <LogoSVG />
        <span className="text-lg text-gray-700 font-semibold tracking-tight">
          Fiji Analytics
        </span>
      </Link>
      <div className="flex items-center">
        <div className="mr-2 flex items-center gap-5">
          <Link href="/#pricing" className="text-gray-600 hover:text-gray-500">
            Pricing
          </Link>
          {!session && (
            <Button asChild size="sm" variant="outline">
              <Link href="/login">Log in</Link>
            </Button>
          )}
          {session && (
            <Button asChild size="sm">
              <Link href="/organizations">Dashboard</Link>
            </Button>
          )}
        </div>
        {!session && (
          <Button asChild size="sm">
            <Link href="/login">Start now</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
