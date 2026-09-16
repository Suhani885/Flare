import Link from "next/link";
import { Sparkles, Droplet, Wind, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  const user = session!.user;

  const analyses = await prisma.analysis.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="container mx-auto px-6 py-24 md:px-12 md:py-32 lg:px-24">
      <h1 className="font-serif text-4xl font-light text-textPrimary md:text-5xl">
        Welcome, <span className="italic text-primary-600">{user.name ?? "there"}</span>
      </h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <span className="rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
          {user.role}
        </span>
        <span className="rounded-full bg-secondary-50 px-4 py-1.5 text-sm font-medium text-secondary-700">
          {user.subscriptionTier} plan
        </span>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/analysis/skin"
          className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:border-primary-300 hover:shadow-md"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Droplet className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-serif text-lg text-textPrimary">New Skin Analysis</p>
            <p className="text-sm text-textMuted">Run the quiz again anytime</p>
          </div>
          <ArrowRight className="h-5 w-5 text-textMuted transition-transform group-hover:translate-x-1 group-hover:text-primary-600" />
        </Link>

        <Link
          href="/analysis/hair"
          className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:border-primary-300 hover:shadow-md"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Wind className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-serif text-lg text-textPrimary">New Hair Analysis</p>
            <p className="text-sm text-textMuted">Run the quiz again anytime</p>
          </div>
          <ArrowRight className="h-5 w-5 text-textMuted transition-transform group-hover:translate-x-1 group-hover:text-primary-600" />
        </Link>
      </div>

      <div className="mt-16">
        <h2 className="mb-6 font-serif text-2xl font-light text-textPrimary">
          Your Analysis History
        </h2>

        {analyses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-textMuted" />
            <p className="text-textSecondary">
              No analyses yet — run a free skin or hair analysis above to get
              your first personalized routine.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map((analysis) => {
              const raw = analysis.resultJson as unknown as { primary_type?: string };
              return (
                <Link
                  key={analysis.id}
                  href={`/dashboard/analysis/${analysis.id}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:border-primary-300 hover:shadow-md"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-600">
                        {analysis.type === "SKIN" ? "Skin" : "Hair"}
                      </span>
                      {analysis.tierUsed === "PREMIUM" && (
                        <span className="rounded-full bg-secondary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-700">
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="mt-2 truncate font-medium text-textPrimary">
                      {raw.primary_type ?? "Analysis result"}
                    </p>
                    <p className="text-sm text-textMuted">
                      {analysis.createdAt.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-textMuted" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
