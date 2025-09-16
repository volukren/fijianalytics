"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { authUserActionClient } from "@/lib/actions/safe-action";
import { auth } from "@/lib/auth/server";

const schema = z.object({ name: z.string().min(1) });

export const createOrganizationAction = authUserActionClient
  .inputSchema(schema)
  .action(async ({ parsedInput, ctx }) => {
    const { name } = parsedInput;

    const data = await auth.api.createOrganization({
      body: {
        name,
        slug: crypto.randomUUID(), // todo: generate slug
        userId: ctx.user.id,
      },
      headers: await headers(),
    });

    console.info("Created organization data: ", data);

    return {
      organizationId: data?.id, // todo: when data can be null, handle it
    };
  });
