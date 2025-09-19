"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { authUserActionClient } from "@/lib/actions/safe-action";
import { auth } from "@/lib/auth/server";

const schema = z.object({ name: z.string().min(1).max(50) });

export const updateUserNameAction = authUserActionClient
  .inputSchema(schema)
  .action(async ({ parsedInput }) => {
    const { name } = parsedInput;

    try {
      const response = await auth.api.updateUser({
        body: {
          name,
        },
        headers: await headers(),
      });

      if (!response) {
        throw new Error("Failed to update user name");
      }

      return {
        success: true,
        name: name,
      };
    } catch (error) {
      console.error("Error updating user name:", error);
      throw new Error("Failed to update user name. Please try again.");
    }
  });
