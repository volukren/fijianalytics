"use client";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateOrganizationNameAction } from "@/lib/actions/organization/update-organization-name";

interface EditOrganizationNameFormProps {
  currentName: string;
  organizationId: string;
}

export default function EditOrganizationNameForm({
  currentName,
  organizationId,
}: EditOrganizationNameFormProps) {
  const [name, setName] = useState(currentName);
  const [originalName] = useState(currentName);
  const router = useRouter();

  const hasChanged = name !== originalName;

  const { executeAsync, isPending } = useAction(updateOrganizationNameAction, {
    onSuccess: () => {
      // Refresh the page to update organizations data
      router.refresh();
      toast.success("Organization name updated successfully");
    },
    onError: (error) => {
      toast.error(
        error.error.serverError || "Failed to update organization name",
      );
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanged) return;

    await executeAsync({ name, organizationId });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Organization name</CardTitle>
          <CardDescription>
            This is the display name for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="org-name">Name</Label>
            <Input
              type="text"
              id="org-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className="max-w-md"
            />
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-neutral-200">
          <span className="text-sm text-neutral-500">Max 100 characters</span>
          <Button
            type="submit"
            disabled={!hasChanged || isPending || !name.trim()}
            size="sm"
          >
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
