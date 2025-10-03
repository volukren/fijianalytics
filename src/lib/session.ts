"use server";

import {prisma} from "@/lib/prisma";

export default async function upsertSession(visitorId: string, domain: string) {
  const now = new Date();

  const session = await prisma.activeSession.upsert({
    where: {
      visitorId_domain: {
        visitorId,
        domain
      }
    },
    update: {
      endedAt: now
    },
    create: {
      visitorId,
      domain,
      startedAt: now,
      endedAt: now
    }
  });

  return session.sessionId;
}