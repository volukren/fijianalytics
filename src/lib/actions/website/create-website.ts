"use server";

import { prisma } from "@/lib/prisma";
import { authUserActionClient } from "../safe-action";
import { z } from "zod";

const schema = z.object({
  domain: z.string().min(1),
  organizationId: z.string().min(1),
});

export const createWebsiteAction = authUserActionClient
  .inputSchema(schema)
  .action(async ({ parsedInput, ctx }) => {
    const { domain, organizationId } = parsedInput;

    const websiteFromDB = await prisma.website.findFirst({
      where: { domain },
    });
    if (websiteFromDB) {
      throw new Error("Website already exists");
    }

    const member = await prisma.member.findFirst({
      where: {
        AND: [
          {
            userId: ctx.user.id,
          },
          {
            organizationId: organizationId,
          },
        ],
      },
    });

    if (!member) {
      throw new Error("You are not a member of this organization");
    }

    const savedSite = await prisma.website.create({
      data: {
        domain,
        organizationId: organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.info("savedSite: ", savedSite);

    return {
      id: savedSite.id,
    };
  });
