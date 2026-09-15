"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

const audienceChips: { label: string; audience: string }[] = [
  { label: "For Her", audience: "WOMEN" },
  { label: "For Him", audience: "MEN" },
  { label: "For Everyone", audience: "UNISEX" },
];

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen items-center pb-20 pt-32 overflow-hidden bg-[#FAFAFA]"
      aria-labelledby="hero-title"
    >
      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="z-10 flex w-full flex-col justify-center lg:w-[55%]">
            <h1
              id="hero-title"
              className="mb-8 font-serif text-5xl font-light leading-[1.05] tracking-tight text-textPrimary md:text-6xl lg:text-[5.5rem]"
            >
              <span className="block">Bespoke Beauty,</span>
              <span className="relative mt-2 block italic text-primary-700">
                Crafted by AI.
              </span>
            </h1>

            <p className="mb-10 max-w-xl text-lg font-light leading-relaxed text-textSecondary md:text-xl">
              Decode your skin &amp; hair&apos;s true needs. Our AI analysis
              creates hyper-personalized routines for every identity, tailored
              to your exact profile &mdash; not just one kind of beauty.
            </p>

            <div className="mb-10 flex flex-wrap items-center gap-3">
              {audienceChips.map((chip) => (
                <Link
                  key={chip.audience}
                  href={`/marketplace?audience=${chip.audience}`}
                  className="rounded-full border border-textPrimary/15 bg-white px-5 py-2 text-sm font-medium text-textPrimary transition-all hover:border-primary-600 hover:text-primary-600 hover:shadow-sm"
                >
                  {chip.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-5 sm:flex-row items-center">
              <Link
                href="/analysis"
                className="group relative flex h-16 items-center justify-center overflow-hidden rounded-full bg-textPrimary px-10 font-medium text-white transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] transition-transform duration-700 group-hover:translate-x-[100%]" />
                <span className="relative z-10 text-base">Begin Analysis</span>
                <ArrowRight className="relative z-10 ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/how-it-works"
                className="group flex h-16 items-center justify-center gap-3 rounded-full px-8 font-medium text-textPrimary transition-all hover:bg-black/5 w-full sm:w-auto"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-textPrimary text-textPrimary transition-transform group-hover:scale-110">
                  <Play className="h-4 w-4 ml-1" />
                </div>
                <span>How it works</span>
              </Link>
            </div>
          </div>

          <div className="relative w-full lg:w-[45%]">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] bg-black/5 shadow-2xl ring-1 ring-black/5">
              <img
                src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&auto=format&fit=crop"
                alt="AI skin and hair analysis"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] hover:scale-105"
              />

              <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/20 bg-white/20 p-6 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between items-center text-white">
                      <span className="font-medium">Beauty Score</span>
                      <span className="font-serif italic font-light text-xl">
                        96%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/30">
                      <div className="h-full w-[96%] rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
