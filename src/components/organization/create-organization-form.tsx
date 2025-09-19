"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/client";

export default function CreateOrganizationForm() {
  const [name, setName] = useState("");
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const { error } = await authClient.organization.create({
        name: name,
        slug: crypto.randomUUID(),
        keepCurrentActiveOrganization: false,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Organization created successfully");
      router.push(`/dashboard`);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Organization name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
          className="w-full"
        />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        size="lg"
        className="w-full cursor-pointer"
      >
        Create organization
      </Button>
    </form>
  );
}
