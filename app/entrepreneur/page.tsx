import Link from "next/link";
import { Plus, Pencil, Package } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/price-format";
import { DeleteProductButton } from "@/components/marketplace/delete-product-button";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-secondary-50 text-secondary-700",
  APPROVED: "bg-primary-50 text-primary-700",
  REJECTED: "bg-red-50 text-red-600",
};

export default async function EntrepreneurPage() {
  const session = await auth();
  const products = await prisma.product.findMany({
    where: { sellerId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-6 py-24 md:px-12 md:py-32 lg:px-24">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-light text-textPrimary md:text-5xl">
            Seller <span className="italic text-primary-600">Dashboard</span>
          </h1>
          <p className="mt-3 text-textSecondary">
            Manage your DIY beauty listings.
          </p>
        </div>
        <Link
          href="/entrepreneur/products/new"
          className="flex items-center gap-2 rounded-full bg-textPrimary px-6 py-3 text-sm font-medium text-white transition-all hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <Package className="mx-auto mb-3 h-8 w-8 text-textMuted" />
          <p className="text-textSecondary">
            No products yet — list your first one to start selling.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                {product.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  />
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[product.status]}`}
                    >
                      {product.status}
                    </span>
                    <span className="text-sm text-textMuted">{product.category}</span>
                  </div>
                  <p className="mt-1 truncate font-medium text-textPrimary">{product.name}</p>
                  <p className="text-sm text-textMuted">
                    {formatPrice(product.price)} · {product.stock} in stock
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/entrepreneur/products/${product.id}/edit`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-textSecondary transition-all hover:border-primary-300 hover:text-primary-600"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeleteProductButton productId={product.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
