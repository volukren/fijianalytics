"use client";

import { ArrowRightIcon } from "lucide-react";
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
      <div className="flex items-center gap-2">
        <div className="mr-2 flex items-center gap-5">
          <Link href="/#pricing" className="text-gray-600 hover:text-gray-500">
            Pricing
          </Link>
          {!session && (
            <Link href="/signin" className="text-gray-600 hover:text-gray-500">
              Sign in
            </Link>
          )}
          {session && (
            <Button asChild size="sm">
              <Link href="/organizations">
                To dashboard
                <ArrowRightIcon size={15} />
              </Link>
            </Button>
          )}
        </div>
        {!session && (
          <Button asChild size="sm">
            <Link href="/signup">Try it for Free</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
