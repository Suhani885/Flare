import Link from "next/link";
import { Search, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/price-format";
import type { Audience } from "@/lib/generated/prisma/enums";
import type { Prisma } from "@/lib/generated/prisma/client";

const VALID_AUDIENCES = ["WOMEN", "MEN", "UNISEX"];

const audienceFilters: { label: string; value: Audience | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "For Her", value: "WOMEN" },
  { label: "For Him", value: "MEN" },
  { label: "For Everyone", value: "UNISEX" },
];

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ audience?: string; category?: string; q?: string }>;
}) {
  const { audience, category, q } = await searchParams;
  const activeAudience = audience?.toUpperCase();

  const where: Prisma.ProductWhereInput = { status: "APPROVED" };
  if (activeAudience && VALID_AUDIENCES.includes(activeAudience)) {
    where.audience = activeAudience as Audience;
  }
  if (category) {
    where.category = { equals: category, mode: "insensitive" };
  }
  if (q) {
    where.name = { contains: q, mode: "insensitive" };
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where, orderBy: { createdAt: "desc" }, take: 60 }),
    prisma.product.findMany({
      where: { status: "APPROVED" },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  return (
    <div className="container mx-auto px-6 py-32 md:px-12 lg:px-24">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-light text-textPrimary md:text-5xl">
          DIY &amp; Sustainable{" "}
          <span className="italic text-primary-600">Marketplace</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-textSecondary font-light">
          Handmade beauty from entrepreneurs, plus eco-conscious sponsor
          brands &mdash; for every skin, hair type, and identity.
        </p>
      </div>

      <form className="mx-auto mb-8 max-w-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search products..."
            className="h-12 w-full rounded-full border border-border bg-white pl-11 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
          {activeAudience && <input type="hidden" name="audience" value={activeAudience} />}
          {category && <input type="hidden" name="category" value={category} />}
        </div>
      </form>

      <div className="mb-6 flex flex-wrap justify-center gap-3">
        {audienceFilters.map((filter) => {
          const params = new URLSearchParams();
          if (filter.value !== "ALL") params.set("audience", filter.value);
          if (category) params.set("category", category);
          if (q) params.set("q", q);
          const href = params.toString() ? `/marketplace?${params}` : "/marketplace";
          const isActive = (activeAudience ?? "ALL") === filter.value;

          return (
            <Link
              key={filter.value}
              href={href}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border-textPrimary/15 bg-white text-textPrimary hover:border-primary-600 hover:text-primary-600"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      {categories.length > 0 && (
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {categories.map(({ category: cat }) => {
            const params = new URLSearchParams();
            if (activeAudience) params.set("audience", activeAudience);
            params.set("category", cat);
            if (q) params.set("q", q);
            const isActive = category?.toLowerCase() === cat.toLowerCase();

            return (
              <Link
                key={cat}
                href={isActive ? "/marketplace" : `/marketplace?${params}`}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-textPrimary text-white"
                    : "bg-surface text-textSecondary hover:bg-surfaceElevated"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/marketplace/${product.slug}`}
            className="group cursor-pointer"
          >
            <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
              {product.images[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-textPrimary backdrop-blur-md">
                {product.category}
              </span>
              {product.sustainabilityScore != null && (
                <span className="absolute right-4 top-4 rounded-full bg-secondary-600/90 px-3 py-1 text-xs font-medium text-white">
                  {product.sustainabilityScore}% eco
                </span>
              )}
              {product.isExternal && (
                <span className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                  <ExternalLink className="h-3 w-3" /> {product.sourceName ?? "External"}
                </span>
              )}
            </div>
            <h3 className="font-serif text-lg font-medium text-textPrimary transition-colors group-hover:text-primary-600">
              {product.name}
            </h3>
            <p className="font-light text-textSecondary">{formatPrice(product.price)}</p>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <p className="py-16 text-center text-textSecondary">
          No products yet for this filter &mdash; check back soon.
        </p>
      )}
    </div>
  );
}
