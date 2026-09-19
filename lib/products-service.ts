import { prisma } from "@/lib/prisma";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Appends a short random suffix on collision rather than failing outright. */
export async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name) || "product";
  let slug = base;
  let attempt = 0;

  while (await prisma.product.findUnique({ where: { slug }, select: { id: true } })) {
    attempt += 1;
    slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
    if (attempt > 5) break;
  }

  return slug;
}
