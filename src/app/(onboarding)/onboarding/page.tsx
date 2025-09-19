import type { Metadata } from "next";
import { StartButton } from "./start-button";

export const metadata: Metadata = {
  title: `Welcome to Fiji Analytics`,
};

export default function OnboardingPage() {
  return (
    <>
      <h1 className="font-bold text-3xl tracking-tight">
        Welcome to Fiji Analytics
      </h1>
      <p className="text-lg tracking-wide text-neutral-500 text-balance">
        Fiji Analytics is a powerful tool for tracking and analyzing your
        website traffic
        {/*todo: replace with actual text */}
      </p>
      <StartButton />
    </>
  );
}
