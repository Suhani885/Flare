import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";
import { generateUniqueSlug } from "@/lib/products-service";
import { rupeesToPaise } from "@/lib/price-format";
import { rateLimit } from "@/lib/rate-limit";
import type { Audience } from "@/lib/generated/prisma/enums";
import type { Prisma } from "@/lib/generated/prisma/client";

const VALID_AUDIENCES = ["WOMEN", "MEN", "UNISEX"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const audience = searchParams.get("audience")?.toUpperCase();
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const minSustainability = searchParams.get("minSustainability");
  const maxPrice = searchParams.get("maxPrice");

  const where: Prisma.ProductWhereInput = { status: "APPROVED" };

  if (audience && VALID_AUDIENCES.includes(audience)) {
    where.audience = audience as Audience;
  }
  if (category) {
    where.category = { equals: category, mode: "insensitive" };
  }
  if (q) {
    where.name = { contains: q, mode: "insensitive" };
  }
  if (minSustainability) {
    where.sustainabilityScore = { gte: Number(minSustainability) };
  }
  if (maxPrice) {
    where.price = { lte: Math.round(Number(maxPrice) * 100) };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ENTREPRENEUR" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ message: "Not authorized to list products." }, { status: 403 });
  }

  const attempt = rateLimit(`create-product:${session.user.id}`, 20, 60 * 60 * 1000);
  if (!attempt.allowed) {
    return NextResponse.json(
      { message: "Too many products created. Please try again later." },
      { status: 429 }
    );
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
  const isAdmin = session.user.role === "ADMIN";

  // Only admins can create external-catalog entries or self-approve.
  const isExternal = isAdmin && data.isExternal;

  const slug = await generateUniqueSlug(data.name);

  const product = await prisma.product.create({
    data: {
      sellerId: isExternal ? null : session.user.id,
      name: data.name,
      slug,
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
      status: isAdmin ? "APPROVED" : "PENDING",
    },
  });

  return NextResponse.json(product, { status: 201 });
}
