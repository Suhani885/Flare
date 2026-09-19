import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Leaf, Check } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/price-format";
import { ProductGallery } from "@/components/marketplace/product-gallery";

const AUDIENCE_LABEL: Record<string, string> = {
  WOMEN: "For Her",
  MEN: "For Him",
  UNISEX: "For Everyone",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { seller: { select: { name: true } } },
  });

  if (!product) notFound();

  if (product.status !== "APPROVED") {
    const session = await auth();
    const isOwner = session?.user?.id === product.sellerId;
    const isAdmin = session?.user?.role === "ADMIN";
    if (!isOwner && !isAdmin) notFound();
  }

  return (
    <div className="container mx-auto px-6 py-24 md:px-12 md:py-32 lg:px-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-700">
              {product.category}
            </span>
            <span className="rounded-full bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-textSecondary">
              {AUDIENCE_LABEL[product.audience]}
            </span>
            {product.sustainabilityScore != null && (
              <span className="flex items-center gap-1 rounded-full bg-secondary-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-secondary-700">
                <Leaf className="h-3.5 w-3.5" /> {product.sustainabilityScore}% eco
              </span>
            )}
          </div>

          <h1 className="mb-3 font-serif text-3xl font-light text-textPrimary md:text-4xl">
            {product.name}
          </h1>
          <p className="mb-6 text-2xl font-light text-primary-600">
            {formatPrice(product.price)}
          </p>

          <p className="mb-8 leading-relaxed text-textSecondary">{product.description}</p>

          {product.benefits.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-3 font-serif text-lg font-medium text-textPrimary">Benefits</h3>
              <ul className="space-y-2">
                {product.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-textSecondary">
                    <Check className="h-4 w-4 shrink-0 text-primary-600" /> {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.ingredients.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-3 font-serif text-lg font-medium text-textPrimary">
                Key Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-border px-3 py-1 text-xs text-textSecondary"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.isExternal ? (
            <a
              href={product.sourceUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-textPrimary px-10 font-medium text-white transition-all hover:scale-[1.02]"
            >
              Visit {product.sourceName ?? "Store"} <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <button
              disabled
              className="inline-flex h-14 cursor-not-allowed items-center justify-center gap-2 rounded-full bg-textPrimary/40 px-10 font-medium text-white"
              title="Checkout is coming soon"
            >
              Checkout coming soon
            </button>
          )}

          {!product.isExternal && product.seller?.name && (
            <p className="mt-4 text-sm text-textMuted">Sold by {product.seller.name}</p>
          )}

          <div className="mt-8">
            <Link
              href="/marketplace"
              className="text-sm font-medium text-textSecondary hover:text-primary-600"
            >
              ← Back to marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
