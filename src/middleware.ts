import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SITE_HOST } from "@/lib/site";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] ?? "";

  // Redirect www and .ca to canonical apex domain
  if (host === `www.${SITE_HOST}` || host === "talentedxpert.ca") {
    const url = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      `https://${SITE_HOST}`,
    );
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};