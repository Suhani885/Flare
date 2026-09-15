import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-24 py-32">
      <h1 className="font-serif text-4xl font-light text-textPrimary md:text-5xl">
        Welcome, <span className="italic text-primary-600">{user?.name ?? "there"}</span>
      </h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <span className="rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
          {user?.role}
        </span>
        <span className="rounded-full bg-secondary-50 px-4 py-1.5 text-sm font-medium text-secondary-700">
          {user?.subscriptionTier} plan
        </span>
      </div>
      <p className="mt-8 max-w-xl text-textSecondary font-light">
        Your AI analysis history, saved products, and community activity will
        show up here soon.
      </p>
    </div>
  );
}
