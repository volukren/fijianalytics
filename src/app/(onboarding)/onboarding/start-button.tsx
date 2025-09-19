"use client";

import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StartButton() {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    router.prefetch("/onboarding/create-organization");

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [router]);

  const handleStart = () => {
    if (isAnimating) {
      return;
    }

    setIsAnimating(true);

    timeoutRef.current = window.setTimeout(() => {
      router.push("/onboarding/create-organization");
    }, 240);
  };

  return (
    <Button
      type="button"
      size="lg"
      disabled={isAnimating}
      onClick={handleStart}
      className={cn(
        "w-full overflow-hidden transition-transform cursor-pointer duration-300",
        isAnimating && "animate-onboarding-press",
      )}
    >
      <span className="flex items-center justify-center gap-2">
        Get started
        <ArrowRightIcon
          size={15}
          className={cn(
            "transition-transform duration-300",
            isAnimating && "translate-x-1.5",
          )}
        />
      </span>
    </Button>
  );
}
