"use client";

import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

export default function SignInForm() {
  return (
    <form className="grid gap-4">
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Button type="submit" size="lg">
        Sign In
      </Button>
    </form>
  );
}
