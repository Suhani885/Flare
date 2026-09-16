"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

const audienceChips: { label: string; audience: string }[] = [
  { label: "For Her", audience: "WOMEN" },
  { label: "For Him", audience: "MEN" },
  { label: "For Everyone", audience: "UNISEX" },
];

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden bg-[#FAFAFA] pb-16 pt-28 sm:pb-20 sm:pt-32"
      aria-labelledby="hero-title"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-primary-200/50 blur-[110px]" />
        <div className="absolute -bottom-32 -left-24 h-[24rem] w-[24rem] rounded-full bg-secondary-200/40 blur-[110px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-24">
          <Reveal className="z-10 flex w-full flex-col justify-center text-center lg:w-[55%] lg:text-left">
            <span className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary-600 sm:text-sm">
              Your Glow. Your Way.
            </span>
            <h1
              id="hero-title"
              className="mb-6 font-serif text-4xl font-light leading-[1.08] tracking-tight text-textPrimary sm:mb-8 sm:text-5xl md:text-6xl lg:text-[5.5rem]"
            >
              <span className="block">Bespoke Beauty,</span>
              <span className="relative mt-1 block italic text-primary-700 sm:mt-2">
                Crafted by AI.
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-base font-light leading-relaxed text-textSecondary sm:mb-10 sm:text-lg md:text-xl lg:mx-0">
              Decode your skin &amp; hair&apos;s true needs. Our AI analysis
              creates hyper-personalized routines for every identity, tailored
              to your exact profile &mdash; not just one kind of beauty.
            </p>

            <div className="mb-8 flex flex-wrap items-center justify-center gap-3 sm:mb-10 lg:justify-start">
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

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5 lg:items-center lg:justify-start">
              <Link
                href="/analysis"
                className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-full bg-textPrimary px-10 font-medium text-white transition-all hover:scale-[1.02] active:scale-[0.98] sm:h-16 sm:w-auto"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative z-10 text-base">Begin Analysis</span>
                <ArrowRight className="relative z-10 ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/how-it-works"
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-full px-8 font-medium text-textPrimary transition-all hover:bg-black/5 sm:h-16 sm:w-auto"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-textPrimary text-textPrimary transition-transform group-hover:scale-110">
                  <Play className="ml-1 h-4 w-4" />
                </div>
                <span>How it works</span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={150} className="relative w-full max-w-md lg:w-[45%] lg:max-w-none">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] bg-black/5 shadow-2xl ring-1 ring-black/5">
              <img
                src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&auto=format&fit=crop"
                alt="AI skin and hair analysis"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] hover:scale-105"
              />

              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-white/20 p-4 backdrop-blur-xl shadow-2xl sm:inset-x-8 sm:bottom-8 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex items-center justify-between text-white">
                      <span className="font-medium">Beauty Score</span>
                      <span className="font-serif text-xl font-light italic">
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
