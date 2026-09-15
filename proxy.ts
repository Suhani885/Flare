import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

const ADMIN_ONLY = ["/admin"];
const ENTREPRENEUR_ONLY = ["/entrepreneur"];
const AUTH_REQUIRED = ["/dashboard", "/checkout", ...ADMIN_ONLY, ...ENTREPRENEUR_ONLY];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  const requiresAuth = AUTH_REQUIRED.some((path) => pathname.startsWith(path));
  if (requiresAuth && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (ADMIN_ONLY.some((path) => pathname.startsWith(path)) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  if (
    ENTREPRENEUR_ONLY.some((path) => pathname.startsWith(path)) &&
    role !== "ENTREPRENEUR" &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/entrepreneur/:path*", "/admin/:path*", "/checkout/:path*"],
};
