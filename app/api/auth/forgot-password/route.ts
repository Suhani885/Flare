import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { generateResetToken, RESET_TOKEN_TTL_MS } from "@/lib/reset-token";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const GENERIC_MESSAGE =
  "If an account exists for that email, we've sent a password reset link.";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const attempt = rateLimit(`forgot-password:${ip}`, 5, 15 * 60 * 1000);
  if (!attempt.allowed) {
    return NextResponse.json(
      { message: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Please enter a valid email." }, { status: 400 });
  }

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Never reveal whether the account exists or is Google-only (no local
  // password to reset) — always return the same message either way.
  if (user?.password) {
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    const { raw, hashed } = generateResetToken();
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashed,
        expires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${raw}&email=${encodeURIComponent(email)}`;

    // No email provider is wired up yet — log it so it's usable locally.
    console.log(`Password reset link for ${email}: ${resetLink}`);

    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ message: GENERIC_MESSAGE, devResetLink: resetLink });
    }
  }

  return NextResponse.json({ message: GENERIC_MESSAGE });
}
