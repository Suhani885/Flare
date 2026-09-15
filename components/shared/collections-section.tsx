import Link from "next/link";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    title: "Luminous Serums",
    img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop",
    tags: ["Hydration", "Glow"],
  },
  {
    title: "Botanical Cleansers",
    img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&auto=format&fit=crop",
    tags: ["Purify", "Soothe"],
  },
  {
    title: "Cellular Recovery",
    img: "https://images.unsplash.com/photo-1571781926291-c477eb31f859?w=600&auto=format&fit=crop",
    tags: ["Anti-Aging", "Repair"],
  },
];

export function CollectionsSection() {
  return (
    <section className="bg-white py-32">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex justify-between items-end mb-16">
          <h2 className="font-serif text-4xl font-light text-textPrimary md:text-5xl max-w-lg leading-tight">
            Curated by <span className="italic text-primary-600">Science</span>,
            Driven by Nature
          </h2>
          <Link
            href="/marketplace"
            className="hidden md:flex items-center gap-2 border-b border-textPrimary pb-1 font-medium text-textPrimary transition-all hover:text-primary-600 hover:border-primary-600"
          >
            View All Collections <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((item) => (
            <div key={item.title} className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface mb-6">
                <img
                  src={item.img}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-transparent" />

                <div className="absolute top-4 left-4 flex gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/80 backdrop-blur-md px-3 py-1 text-xs font-medium text-textPrimary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="text-xl font-serif font-medium text-textPrimary group-hover:text-primary-600 transition-colors">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
