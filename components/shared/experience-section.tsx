import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";

export function ExperienceSection() {
  return (
    <section className="relative mx-4 mb-20 overflow-hidden rounded-[2rem] bg-textPrimary py-20 text-white sm:mb-32 sm:rounded-[3rem] sm:py-32 md:mx-12">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />

      <Reveal className="container relative z-10 mx-auto px-6 text-center md:px-12">
        <h2 className="mx-auto mb-8 max-w-3xl font-serif text-2xl font-light leading-tight sm:text-4xl md:text-6xl">
          &ldquo;The precision of AI merged with the purity of clean beauty
          &mdash; for every skin, every identity.&rdquo;
        </h2>

        <Link
          href="/analysis"
          className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 font-medium text-textPrimary transition-all hover:scale-105 hover:bg-primary-50"
        >
          Experience Now
        </Link>
      </Reveal>
    </section>
  );
}
