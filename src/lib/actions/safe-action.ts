import { headers } from "next/headers";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "@/lib/auth/server";

export const actionClient = createSafeActionClient({
  handleServerError: (e) => {
    console.error("Server action error: ", e);
    return e.message;
  },
});

export const authUserActionClient = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized: Login required.");
  }

  return next({
    ctx: {
      user: session.user,
      organization: session.user,
    },
  });
});
