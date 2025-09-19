"use client";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserNameAction } from "@/lib/actions/user/update-user-name";

interface EditNameFormProps {
  currentName: string;
}

export default function EditNameForm({ currentName }: EditNameFormProps) {
  const [name, setName] = useState(currentName);
  const [originalName] = useState(currentName);

  const hasChanged = name !== originalName;

  const { executeAsync, isPending } = useAction(updateUserNameAction, {
    onSuccess: () => {
      toast.success("Name updated successfully");
    },
    onError: (error) => {
      toast.error(error.error.serverError || "Failed to update name");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanged) return;

    await executeAsync({ name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Your name</CardTitle>
          <CardDescription>
            This is your display name on Fiji Analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className="max-w-md"
            />
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-neutral-200">
          <span className="text-sm text-neutral-500">Max 50 characters</span>
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
