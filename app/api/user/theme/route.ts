import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  audiencePreference: z.enum(["WOMEN", "MEN", "UNISEX"]).nullable(),
});

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Not signed in" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid preference" }, { status: 400 });
  }

  const { audiencePreference } = parsed.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { audiencePreference },
  });

  return NextResponse.json({ audiencePreference });
}
