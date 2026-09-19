import { Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/price-format";
import { ProductApprovalActions } from "@/components/marketplace/product-approval-actions";

export default async function AdminPage() {
  const pendingProducts = await prisma.product.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: { seller: { select: { name: true, email: true } } },
  });

  return (
    <div className="container mx-auto px-6 py-24 md:px-12 md:py-32 lg:px-24">
      <h1 className="font-serif text-4xl font-light text-textPrimary md:text-5xl">
        Admin <span className="italic text-primary-600">Panel</span>
      </h1>
      <p className="mt-6 max-w-xl text-textSecondary font-light">
        User management, community moderation, and revenue tracking are
        coming in a later phase.
      </p>

      <div className="mt-12">
        <h2 className="mb-6 font-serif text-2xl font-light text-textPrimary">
          Pending Product Approvals
        </h2>

        {pendingProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
            <Package className="mx-auto mb-3 h-8 w-8 text-textMuted" />
            <p className="text-textSecondary">Nothing waiting for review.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingProducts.map((product) => (
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
                    <p className="truncate font-medium text-textPrimary">{product.name}</p>
                    <p className="text-sm text-textMuted">
                      {formatPrice(product.price)} · {product.category} ·{" "}
                      {product.seller?.name ?? product.seller?.email ?? "Unknown seller"}
                    </p>
                  </div>
                </div>
                <ProductApprovalActions productId={product.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
