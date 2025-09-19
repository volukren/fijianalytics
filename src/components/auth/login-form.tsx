"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/client";
import GithubIcon from "../icons/github";
import GoogleIcon from "../icons/google";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import AuthMethodsSeparator from "./auth-methods-separator";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          className="w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button
        onClick={async () => {
          setIsPending(true);
          const { error } = await authClient.signIn.magicLink({
            email: email,
            callbackURL: "/organizations",
            newUserCallbackURL: "/onboarding",
          });
          setIsPending(false);
          if (error) {
            toast.error(error.message);
            return;
          }
          toast.success(
            "We sent you a login link to your email. Please check your inbox",
          );
        }}
        disabled={isPending}
        type="button"
        className="w-full cursor-pointer"
        size="lg"
      >
        {isPending ? "Sending login link..." : "Continue with email"}
      </Button>
      <AuthMethodsSeparator />
      <div className="space-y-2">
        <Button
          type="button"
          className="w-full cursor-pointer"
          size="lg"
          variant="outline"
          onClick={async () => {
            await authClient.signIn.social({
              provider: "google",
              callbackURL: "/organizations",
              newUserCallbackURL: "/onboarding",
            });
          }}
        >
          <GoogleIcon w={18} h={18} />
          Continue with Google
        </Button>
        <Button
          type="button"
          className="w-full cursor-pointer"
          size="lg"
          variant="outline"
          onClick={async () => {
            await authClient.signIn.social({
              provider: "github",
              callbackURL: "/organizations",
              newUserCallbackURL: "/onboarding",
            });
          }}
        >
          <GithubIcon w={18} h={18} />
          Continue with Github
        </Button>
      </div>
    </div>
  );
}
