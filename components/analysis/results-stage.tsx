"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Check,
  FlaskConical,
  ShieldCheck,
  Zap,
  Star,
  Sparkles,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import type { AnalysisResult, AnalysisType } from "@/types/analysis";

interface ResultsStageProps {
  result: AnalysisResult;
  type: AnalysisType;
  onReset: () => void;
}

export function ResultsStage({ result, type, onReset }: ResultsStageProps) {
  const { primaryType, secondaryType, concerns, recommendations } = result;
  const { data: session } = useSession();
  const isPremium = session?.user?.subscriptionTier === "PREMIUM";

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] overflow-hidden px-4 py-20 pt-28">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-accent-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-200 px-5 py-2 text-sm font-semibold text-primary-600">
            <Check className="h-4 w-4" /> Analysis Complete
          </span>
          <h1 className="font-serif text-4xl font-light text-textPrimary mb-4 md:text-5xl">
            Your {type === "skin" ? "Skin" : "Hair"}{" "}
            <span className="italic text-primary-600">Profile</span>
          </h1>
          <div className="inline-block rounded-full bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-3 text-white font-semibold text-lg shadow-lg shadow-primary-500/30">
            {primaryType}
            {secondaryType && (
              <span className="font-light opacity-80"> · {secondaryType}</span>
            )}
          </div>
        </div>

        {concerns.length > 0 && (
          <div className="mb-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h3 className="font-serif text-lg font-medium text-textPrimary mb-4">
              Identified Concerns
            </h3>
            <div className="flex flex-wrap gap-2">
              {concerns.map((c, i) => (
                <span
                  key={i}
                  className="rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h3 className="font-serif text-lg font-medium text-textPrimary mb-5 flex items-center gap-2">
            <Check className="h-5 w-5 text-primary-600" />
            Recommended {type === "skin" ? "Skincare" : "Haircare"} Routine
          </h3>
          <ul className="space-y-3">
            {recommendations.routine.map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl bg-surface p-4">
                <div className="flex h-6 w-6 flex-shrink-0 mt-0.5 items-center justify-center rounded-full bg-primary-600 text-white text-xs font-bold">
                  {i + 1}
                </div>
                <span className="text-sm text-textSecondary">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h3 className="font-serif text-lg font-medium text-textPrimary mb-4 flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-primary-500" />
              Beneficial Ingredients
            </h3>
            <ul className="space-y-2">
              {recommendations.ingredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-textSecondary">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-50 text-primary-600 text-xs font-bold flex-shrink-0">
                    ✓
                  </div>
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h3 className="font-serif text-lg font-medium text-textPrimary mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-red-400" />
              Ingredients to Avoid
            </h3>
            <ul className="space-y-2">
              {recommendations.avoidIngredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-textSecondary">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-red-400 text-xs font-bold flex-shrink-0">
                    ✕
                  </div>
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h3 className="font-serif text-lg font-medium text-textPrimary mb-5 flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary-500" />
            Lifestyle Considerations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendations.lifestyleConsiderations.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-surface p-4">
                <div className="flex h-6 w-6 flex-shrink-0 mt-0.5 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm text-textSecondary">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {recommendations.products && recommendations.products.length > 0 && (
          <div className="mb-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h3 className="font-serif text-lg font-medium text-textPrimary mb-5 flex items-center gap-2">
              <Star className="h-5 w-5 text-primary-500" />
              Curated Product Picks
            </h3>
            <div className="space-y-4">
              {recommendations.products.map((product, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-xl border border-border p-4 hover:border-primary-300 hover:bg-primary-50/30 transition-all"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 font-bold text-sm">
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-textPrimary">
                        {product.name}
                      </span>
                      <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs text-primary-700 font-medium">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-xs text-textMuted mt-1">{product.why}</p>
                  </div>
                  <Link
                    href={`/marketplace?q=${encodeURIComponent(product.name)}`}
                    className="flex-shrink-0 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-700 hover:bg-primary-600 hover:text-white transition-all"
                  >
                    Shop
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isPremium && (
          <div className="mb-8 rounded-2xl border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg font-medium text-primary-700 mb-2">
                  Unlock Premium Analysis
                </h3>
                <p className="text-sm text-textSecondary mb-4 leading-relaxed">
                  Get a full 30-day personalised routine calendar, deeper ingredient analysis, dermatologist notes, and early access to new product launches matched to your profile.
                </p>
                <Link href="/subscription" className="inline-block rounded-full bg-primary-600 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:scale-[1.02] shadow-md shadow-primary-500/30">
                  Upgrade to Premium
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onReset}
            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-border py-3.5 text-sm font-semibold text-textSecondary transition-all hover:border-textPrimary hover:text-textPrimary sm:w-auto sm:px-8"
          >
            <RotateCcw className="h-4 w-4" /> Start Over
          </button>
          <Link
            href="/marketplace"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-textPrimary py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary-700 sm:w-auto sm:px-8"
          >
            Shop Recommendations <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
