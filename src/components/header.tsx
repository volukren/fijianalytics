"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { Button } from "./ui/button";

export default function Header() {
  const { data: session } = authClient.useSession();

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link href="/">
          <span className="text-lg text-neutral-900 font-semibold tracking-tight">
            Fiji Analytics
          </span>
        </Link>
        <div className="flex items-center ml-4">
          <Button asChild size="sm" variant="ghost">
            <Link
              href="/#pricing"
              className="px-2 py-0.5 text-sm rounded-lg hover:bg-neutral-200 hover:text-neutral-900 text-neutral-800 duration-200 transition-colors"
            >
              Pricing
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link
              href="/#faq"
              className="px-2 py-0.5 text-sm rounded-lg hover:bg-neutral-200 hover:text-neutral-900 text-neutral-800 duration-200 transition-colors"
            >
              FAQ
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-5">
        {!session && (
          <Button asChild size="sm" variant="outline">
            <Link href="/login">Log in</Link>
          </Button>
        )}
        {session && (
          <Button asChild size="sm">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        )}
        {!session && (
          <Button asChild size="sm">
            <Link href="/login">Start now</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
