import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserFromRequest } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Temporarily disable authentication for development
  // TODO: Re-enable authentication once getUserFromRequest is properly implemented

  // Protected routes that require authentication
  if (pathname.startsWith("/dashboard")) {
    // const user = await getUserFromRequest(request)
    // if (!user) {
    //   return NextResponse.redirect(new URL("/auth/login", request.url))
    // }
    // Role-based access control
    // if (pathname.startsWith("/dashboard/customer") && user.role !== "customer") {
    //   return NextResponse.redirect(new URL("/dashboard/mechanic", request.url))
    // }
    // if (pathname.startsWith("/dashboard/mechanic") && user.role !== "mechanic") {
    //   return NextResponse.redirect(new URL("/dashboard/customer", request.url))
    // }
  }

  // API routes protection
  if (pathname.startsWith("/api/protected")) {
    // const user = await getUserFromRequest(request)
    // if (!user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
