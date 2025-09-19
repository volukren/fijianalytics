"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { createWebsiteAction } from "@/lib/actions/website/create-website";
import { authClient } from "@/lib/auth/client";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function CreateWebsiteForm() {
  const [domain, setDomain] = useState("");

  const { data: activeOrganization } = authClient.useActiveOrganization();

  const router = useRouter();

  const { executeAsync, isPending } = useAction(createWebsiteAction, {
    onSuccess: () => {
      toast.success("Website added successfully");
      router.push(`/dashboard`);
    },
    onError: (error) => {
      toast.error(error.error.serverError || "Failed to add website");
    },
  });

  if (!activeOrganization) {
    return <div>No active organization</div>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        executeAsync({
          domain: domain,
          organizationId: activeOrganization.id,
        });
      }}
      className="grid gap-4 max-w-2xl mx-auto"
    >
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Add a new website</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="domain">
              Domain <span className="text-red-600">*</span>
            </Label>
            <Input
              id="domain"
              name="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="google.com"
              required
              disabled={isPending}
            />
            <p className="text-xs text-gray-500">
              Only the domain, without https
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending} className="w-full">
            Add website
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
