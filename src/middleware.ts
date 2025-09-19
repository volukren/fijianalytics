import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

export async function middleware(request: NextRequest) {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!request.nextUrl.pathname.startsWith("/onboarding")) {
    const organizations = await auth.api.listOrganizations({
      headers: headersList,
    });
    if (organizations.length === 0) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/account",
    "/settings:path*",
    "/onboarding:path*",
    "/dashboard:path*",
  ],
};
