"use client";

import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

export default function SignUpForm() {
  return (
    <form className="grid gap-4">
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Input type="password" placeholder="Confirm Password" />
      <Button type="submit" size="lg">
        Sign Up
      </Button>
    </form>
  );
}
