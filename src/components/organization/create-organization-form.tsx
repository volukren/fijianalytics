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
  const [formValues, setFormValues] = useState({
    name: "",
    slug: "",
  });
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const { data, error } = await authClient.organization.create(formValues);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Organization created successfully");
      router.push(`/organizations/${data!.id}`);
    } finally {
      setIsPending(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((previous) => ({ ...previous, [name]: value }));
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
          value={formValues.name}
          onChange={handleChange}
          disabled={isPending}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          type="text"
          id="slug"
          name="slug"
          placeholder="my-org-1"
          required
          value={formValues.slug}
          onChange={handleChange}
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
