"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
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
  const [slug, setSlug] = useState("");

  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    const { data, error } = await authClient.organization.create({
      name: name,
      slug: slug,
    });
    setIsPending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    router.push(`/organizations/${data!.id}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-none max-w-2xl mx-auto w-full">
        <CardHeader className="border-b border-gray-200">
          <CardTitle>Create a new organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="col-span-2">
              Name <span className="text-red-600">*</span>
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Organization name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug" className="col-span-2">
              Slug <span className="text-red-600">*</span>
            </Label>
            <Input
              type="text"
              id="slug"
              name="slug"
              placeholder="my-org-1"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={isPending}
            />
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-gray-200">
          <Button onClick={() => router.back()} size="sm" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} size="sm">
            Create organization
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
