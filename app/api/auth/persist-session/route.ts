import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * NextAuth's own session cookie Max-Age is a single static value
 * (session.maxAge in auth.config.ts) — it can't vary per sign-in via any
 * callback. To support "remember me", we let every sign-in use that
 * persistent 30-day cookie by default, then call this route right after
 * signIn() when the user did NOT check "remember me": it re-issues the same
 * session cookie (same name/value/flags) but omits Max-Age, which turns it
 * into a browser-session cookie — cleared when the browser closes — without
 * touching the JWT's own validity window.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const remember = body?.remember === true;

  if (remember) {
    return NextResponse.json({ ok: true });
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.getAll().find((c) => c.name.endsWith("session-token"));

  if (sessionCookie) {
    cookieStore.set(sessionCookie.name, sessionCookie.value, {
      httpOnly: true,
      secure: sessionCookie.name.startsWith("__Secure-"),
      sameSite: "lax",
      path: "/",
      // No maxAge/expires: browser treats this as a session-only cookie.
    });
  }

  return NextResponse.json({ ok: true });
}
