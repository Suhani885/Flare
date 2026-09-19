import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";
import { rupeesToPaise } from "@/lib/price-format";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  if (product.status === "APPROVED") {
    return NextResponse.json(product);
  }

  // Non-approved products are only visible to their owner or an admin.
  const session = await auth();
  const isOwner = session?.user?.id === product.sellerId;
  const isAdmin = session?.user?.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 });
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  const isAdmin = session.user.role === "ADMIN";
  const isOwner = existing.sellerId === session.user.id;
  if (!isAdmin && !isOwner) {
    return NextResponse.json({ message: "Not authorized to edit this product." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid product data." },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const isExternal = isAdmin && data.isExternal;

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: rupeesToPaise(data.price),
      images: data.images,
      ingredients: data.ingredients,
      benefits: data.benefits,
      category: data.category,
      audience: data.audience,
      sustainabilityScore: data.sustainabilityScore ?? null,
      stock: data.stock,
      isExternal,
      sourceUrl: isExternal && data.sourceUrl ? data.sourceUrl : null,
      sourceName: isExternal && data.sourceName ? data.sourceName : null,
      // A seller edit sends an approved listing back for re-review; admins
      // editing don't get silently bounced back to pending.
      status: !isAdmin && existing.status === "APPROVED" ? "PENDING" : existing.status,
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 });
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  const isAdmin = session.user.role === "ADMIN";
  const isOwner = existing.sellerId === session.user.id;
  if (!isAdmin && !isOwner) {
    return NextResponse.json({ message: "Not authorized to delete this product." }, { status: 403 });
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
