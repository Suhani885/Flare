import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { hashResetToken } from "@/lib/reset-token";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const INVALID_MESSAGE = "This reset link is invalid or has expired.";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const attempt = rateLimit(`reset-password:${ip}`, 10, 15 * 60 * 1000);
  if (!attempt.allowed) {
    return NextResponse.json(
      { message: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email, token, password } = parsed.data;
  const hashed = hashResetToken(token);

  const record = await prisma.verificationToken.findUnique({ where: { token: hashed } });

  if (!record || record.identifier !== email || record.expires < new Date()) {
    return NextResponse.json({ message: INVALID_MESSAGE }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: INVALID_MESSAGE }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } }),
    // Single-use: delete the token (and any other pending ones for this email).
    prisma.verificationToken.deleteMany({ where: { identifier: email } }),
  ]);

  return NextResponse.json({ message: "Your password has been reset. Please sign in." });
}
