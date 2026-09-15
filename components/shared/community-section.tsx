import Link from "next/link";
import { ArrowRight } from "lucide-react";

const communityImages = [
  {
    id: 1,
    url: "https://plus.unsplash.com/premium_photo-1708333927598-a13a4944de1c?w=900&auto=format&fit=crop",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1631631913169-42b2b6ce3d2c?w=900&auto=format&fit=crop",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1712481846921-d5df6dc4abfd?w=900&auto=format&fit=crop",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1584013482381-b54c4a726a08?w=900&auto=format&fit=crop",
  },
];

export function CommunitySection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-8 leading-tight text-textPrimary">
              <span className="block">Join Our</span>
              <span className="block mt-2 relative italic text-primary-600">
                Beauty Community
              </span>
            </h2>
            <p className="text-lg leading-relaxed mb-8 text-textSecondary font-light">
              Connect with like-minded people, share skincare &amp; haircare
              tips, and participate in discussions about products, techniques,
              and experiences &mdash; whoever you are.
            </p>
            <ul className="space-y-4 mb-10">
              {["Beauty Forums", "Expert Q&A Sessions", "Product Reviews"].map(
                (item) => (
                  <li key={item} className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-4 bg-primary-50">
                      <span className="text-primary-600 text-sm">✧</span>
                    </div>
                    <span className="text-textPrimary">{item}</span>
                  </li>
                )
              )}
            </ul>
            <Link
              href="/community"
              className="inline-flex items-center px-8 py-4 rounded-full bg-textPrimary text-white font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Join Community <ArrowRight size={18} className="ml-3" />
            </Link>
          </div>

          <div className="lg:w-1/2 grid grid-cols-2 gap-4 w-full">
            {communityImages.map((img, index) => (
              <div
                key={img.id}
                className={`aspect-square rounded-2xl overflow-hidden shadow-sm ${
                  index % 2 !== 0 ? "translate-y-8" : ""
                }`}
              >
                <img
                  src={img.url}
                  alt={`Community image ${img.id}`}
                  className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
