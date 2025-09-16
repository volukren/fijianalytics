import { auth } from "./server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSessionOrRedirect() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/signin");
  }

  return session;
}
