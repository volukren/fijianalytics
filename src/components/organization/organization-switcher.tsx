"use client";

import { useCallback, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

interface OrganizationSwitcherProps {
  className?: string;
}

export default function OrganizationSwitcher({
  className,
}: OrganizationSwitcherProps) {
  const {
    data: organizations,
    isPending: isListPending,
  } = authClient.useListOrganizations();
  const {
    data: activeOrganization,
    isPending: isActivePending,
  } = authClient.useActiveOrganization();
  const [isSwitching, setIsSwitching] = useState(false);

  const isLoading = isListPending || isActivePending;
  const organizationOptions = useMemo(
    () => organizations ?? [],
    [organizations]
  );

  const handleOrganizationChange = useCallback(
    async (organizationId: string) => {
      if (organizationId === activeOrganization?.id) {
        return;
      }

      setIsSwitching(true);
      try {
        const { error } = await authClient.organization.setActive({
          organizationId,
        });

        if (error) {
          toast.error(error.message ?? "Unable to switch organization");
          return;
        }

        const nextOrganization = organizationOptions.find(
          (organization) => organization.id === organizationId
        );

        toast.success(
          nextOrganization
            ? `Switched to ${nextOrganization.name}`
            : "Active organization updated"
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to switch organization"
        );
      } finally {
        setIsSwitching(false);
      }
    },
    [activeOrganization?.id, organizationOptions]
  );

  const isDisabled =
    isLoading || isSwitching || organizationOptions.length === 0;
  const placeholder = organizationOptions.length
    ? "Select an organization"
    : "No organizations found";

  return (
    <Select
      value={activeOrganization?.id ?? undefined}
      onValueChange={handleOrganizationChange}
      disabled={isDisabled}
    >
      <SelectTrigger
        size="sm"
        className={cn(
          "w-56 justify-between",
          (isLoading || isSwitching) && "cursor-progress",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
        {(isLoading || isSwitching) && (
          <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
        )}
      </SelectTrigger>
      <SelectContent>
        {organizationOptions.map((organization) => (
          <SelectItem key={organization.id} value={organization.id}>
            {organization.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
