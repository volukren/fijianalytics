"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { authUserActionClient } from "@/lib/actions/safe-action";
import { auth } from "@/lib/auth/server";

const schema = z.object({
  name: z.string().min(1).max(100),
  organizationId: z.string(),
});

export const updateOrganizationNameAction = authUserActionClient
  .inputSchema(schema)
  .action(async ({ parsedInput }) => {
    const { name, organizationId } = parsedInput;

    try {
      const response = await auth.api.updateOrganization({
        body: {
          data: {
            name,
          },
          organizationId,
        },
        headers: await headers(),
      });

      if (!response) {
        throw new Error("Failed to update organization name");
      }

      return {
        success: true,
        name: name,
      };
    } catch (error) {
      console.error("Error updating organization name:", error);
      throw new Error("Failed to update organization name. Please try again.");
    }
  });
