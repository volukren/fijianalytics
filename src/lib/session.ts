"use server";

import {prisma} from "@/lib/prisma";

export default async function upsertSession(visitorId: string, domain: string) {
  const now = new Date();

  const existingActiveSession = await prisma.activeSession.findFirst({
    where: {
      visitorId: visitorId,
      domain: domain
    }
  });

  if (existingActiveSession) {
    await prisma.activeSession.update({
      data: {
        endedAt: now,
      },
      where: {
        sessionId: existingActiveSession.sessionId
      }
    })
    return existingActiveSession.sessionId;
  }

  const session = await prisma.activeSession.create({
    data: {
      visitorId,
      domain,
      startedAt: now,
      endedAt: now
    }
  });

  return session.sessionId;
}