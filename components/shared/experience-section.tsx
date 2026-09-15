import Link from "next/link";

export function ExperienceSection() {
  return (
    <section className="bg-textPrimary text-white py-32 rounded-[3rem] mx-4 md:mx-12 mb-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616683693504-3ea7e9ad6ece?w=1200&auto=format&fit=crop')] opacity-20 mix-blend-overlay bg-cover bg-center" />

      <div className="container relative z-10 mx-auto px-6 md:px-12 text-center">
        <h2 className="mx-auto max-w-3xl font-serif text-4xl font-light leading-tight md:text-6xl mb-8">
          &ldquo;The precision of AI merged with the purity of clean beauty
          &mdash; for every skin, every identity.&rdquo;
        </h2>

        <Link
          href="/analysis"
          className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 font-medium text-textPrimary transition-all hover:bg-primary-50 hover:scale-105"
        >
          Experience Now
        </Link>
      </div>
    </section>
  );
}
