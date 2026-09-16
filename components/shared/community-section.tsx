import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

const communityImages = [
  {
    id: 1,
    url: "https://plus.unsplash.com/premium_photo-1708333927598-a13a4944de1c?w=900&auto=format&fit=crop",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&auto=format&fit=crop",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1712481846921-d5df6dc4abfd?w=900&auto=format&fit=crop",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&auto=format&fit=crop",
  },
];

export function CommunitySection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          <Reveal className="w-full lg:w-1/2">
            <h2 className="mb-6 font-serif text-3xl font-light leading-tight text-textPrimary sm:mb-8 sm:text-4xl md:text-5xl">
              <span className="block">Join Our</span>
              <span className="relative mt-2 block italic text-primary-600">
                Beauty Community
              </span>
            </h2>
            <p className="mb-8 text-base font-light leading-relaxed text-textSecondary sm:text-lg">
              Connect with like-minded people, share skincare &amp; haircare
              tips, and participate in discussions about products, techniques,
              and experiences &mdash; whoever you are.
            </p>
            <ul className="mb-8 space-y-4 sm:mb-10">
              {["Beauty Forums", "Expert Q&A Sessions", "Product Reviews"].map(
                (item) => (
                  <li key={item} className="flex items-center">
                    <div className="mr-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50">
                      <span className="text-sm text-primary-600">✧</span>
                    </div>
                    <span className="text-textPrimary">{item}</span>
                  </li>
                )
              )}
            </ul>
            <Link
              href="/community"
              className="inline-flex items-center rounded-full bg-textPrimary px-8 py-4 font-medium text-white shadow-md transition-all hover:shadow-lg active:scale-95"
            >
              Join Community <ArrowRight size={18} className="ml-3" />
            </Link>
          </Reveal>

          <Reveal delay={150} className="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:w-1/2">
            {communityImages.map((img, index) => (
              <div
                key={img.id}
                className={`aspect-square overflow-hidden rounded-2xl shadow-sm ${
                  index % 2 !== 0 ? "translate-y-6 sm:translate-y-8" : ""
                }`}
              >
                <img
                  src={img.url}
                  alt={`Community image ${img.id}`}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
