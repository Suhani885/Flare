import Link from "next/link";

type Audience = "WOMEN" | "MEN" | "UNISEX";

interface SampleProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  audience: Audience;
  sustainabilityScore: number;
  image: string;
}

const sampleProducts: SampleProduct[] = [
  {
    id: "1",
    name: "Rosewater Glow Serum",
    category: "Skincare",
    price: 899,
    audience: "WOMEN",
    sustainabilityScore: 92,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Charcoal Detox Face Wash",
    category: "Skincare",
    price: 549,
    audience: "MEN",
    sustainabilityScore: 85,
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Everyday Argan Hair Oil",
    category: "Haircare",
    price: 649,
    audience: "UNISEX",
    sustainabilityScore: 88,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop",
  },
];

const filters: { label: string; value: Audience | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "For Her", value: "WOMEN" },
  { label: "For Him", value: "MEN" },
  { label: "For Everyone", value: "UNISEX" },
];

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ audience?: string }>;
}) {
  const { audience } = await searchParams;
  const activeAudience = (audience?.toUpperCase() as Audience | undefined) ?? "ALL";

  const products =
    activeAudience === "ALL"
      ? sampleProducts
      : sampleProducts.filter((p) => p.audience === activeAudience);

  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-24 py-32">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-light text-textPrimary md:text-5xl">
          DIY &amp; Sustainable{" "}
          <span className="italic text-primary-600">Marketplace</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-textSecondary font-light">
          Handmade beauty from women entrepreneurs, plus eco-conscious sponsor
          brands &mdash; for every skin, hair type, and identity.
        </p>
      </div>

      <div className="mb-12 flex flex-wrap justify-center gap-3">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={filter.value === "ALL" ? "/marketplace" : `/marketplace?audience=${filter.value}`}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-all ${
              activeAudience === filter.value
                ? "border-primary-600 bg-primary-600 text-white"
                : "border-textPrimary/15 bg-white text-textPrimary hover:border-primary-600 hover:text-primary-600"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 rounded-full bg-white/80 backdrop-blur-md px-3 py-1 text-xs font-medium text-textPrimary">
                {product.category}
              </span>
              <span className="absolute top-4 right-4 rounded-full bg-secondary-600/90 px-3 py-1 text-xs font-medium text-white">
                {product.sustainabilityScore}% eco
              </span>
            </div>
            <h3 className="text-lg font-serif font-medium text-textPrimary group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-textSecondary font-light">₹{product.price}</p>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-textSecondary py-16">
          No products yet for this filter &mdash; check back soon.
        </p>
      )}
    </div>
  );
}
