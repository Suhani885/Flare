import { Check } from "lucide-react";
import { auth } from "@/lib/auth";
import { BuyButton } from "@/components/marketplace/buy-button";

const FREE_FEATURES = ["Basic skin & hair analysis", "Community access", "Marketplace browsing & buying"];
const PREMIUM_FEATURES = [
  "Everything in Free",
  "In-depth AI analysis (larger model, fuller routine)",
  "Priority support",
];

export default async function SubscriptionPage() {
  const session = await auth();
  const isPremium = session?.user?.subscriptionTier === "PREMIUM";

  return (
    <div className="container mx-auto max-w-3xl px-6 py-24 text-center md:px-12 md:py-32">
      <h1 className="font-serif text-4xl font-light text-textPrimary md:text-5xl">
        Choose Your <span className="italic text-primary-600">Plan</span>
      </h1>
      <p className="mt-4 text-textSecondary">Upgrade anytime for deeper AI insights.</p>

      <div className="mt-12 grid grid-cols-1 gap-6 text-left sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-8">
          <h2 className="mb-1 font-serif text-2xl text-textPrimary">Free</h2>
          <p className="mb-6 text-textMuted">₹0</p>
          <ul className="space-y-3">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-textSecondary">
                <Check className="h-4 w-4 shrink-0 text-primary-600" /> {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-primary-600 bg-primary-50/40 p-8">
          <h2 className="mb-1 font-serif text-2xl text-textPrimary">Premium</h2>
          <p className="mb-6 text-textMuted">₹299/month</p>
          <ul className="mb-6 space-y-3">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-textSecondary">
                <Check className="h-4 w-4 shrink-0 text-primary-600" /> {f}
              </li>
            ))}
          </ul>
          {isPremium ? (
            <p className="text-sm font-medium text-primary-700">You&apos;re already Premium ✨</p>
          ) : session?.user ? (
            <BuyButton
              purpose="subscription"
              label="Upgrade to Premium"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary-600 font-medium text-white transition-all hover:bg-primary-700 disabled:opacity-60"
            />
          ) : (
            <p className="text-sm text-textMuted">Sign in to upgrade.</p>
          )}
        </div>
      </div>
    </div>
  );
}
