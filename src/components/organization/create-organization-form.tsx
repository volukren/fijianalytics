"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-2xl mx-auto">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Create a new organization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="name">
              Organization name <span className="text-red-600">*</span>
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="My Organization"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
            <p className="text-xs text-gray-500">
              Choose a name for your team or project
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full cursor-pointer"
          >
            Create organization
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
