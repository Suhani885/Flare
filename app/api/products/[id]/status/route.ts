import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productStatusSchema } from "@/lib/validations/product";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Admin only." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = productStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid status." }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  const product = await prisma.product.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json(product);
}
