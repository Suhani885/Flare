import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

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
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop",
    tags: ["Anti-Aging", "Repair"],
  },
];

export function CollectionsSection() {
  return (
    <section className="bg-white py-20 sm:py-24 md:py-32">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <Reveal className="mb-12 flex flex-col items-start justify-between gap-4 sm:mb-16 sm:flex-row sm:items-end">
          <h2 className="max-w-lg font-serif text-3xl font-light leading-tight text-textPrimary sm:text-4xl md:text-5xl">
            Curated by <span className="italic text-primary-600">Science</span>,
            Driven by Nature
          </h2>
          <Link
            href="/marketplace"
            className="hidden shrink-0 items-center gap-2 whitespace-nowrap border-b border-textPrimary pb-1 font-medium text-textPrimary transition-all hover:border-primary-600 hover:text-primary-600 md:flex"
          >
            View All Collections <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {collections.map((item, index) => (
            <Reveal key={item.title} delay={index * 100} className="group cursor-pointer">
              <div className="relative aspect-4/5 mb-6 overflow-hidden rounded-2xl bg-surface">
                <img
                  src={item.img}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-transparent" />

                <div className="absolute left-4 top-4 flex gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-textPrimary backdrop-blur-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="font-serif text-xl font-medium text-textPrimary transition-colors group-hover:text-primary-600">
                {item.title}
              </h3>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
