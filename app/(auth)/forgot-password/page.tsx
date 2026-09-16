import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-background px-4 py-8 sm:py-12">
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute -left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-primary-500/20 blur-[100px]" />
        <div className="absolute -right-[10%] bottom-[10%] h-[600px] w-[600px] rounded-full bg-accent-500/20 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <h1 className="font-serif text-3xl text-textPrimary sm:text-4xl">
            Reset Your <span className="italic text-primary-500">Password</span>
          </h1>
          <p className="mt-3 text-sm text-textSecondary sm:text-base">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/20 bg-surface/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <ForgotPasswordForm />
        </div>

        <p className="mt-8 text-center text-xs text-textMuted">
          Remembered it after all?{" "}
          <Link href="/login" className="underline transition-colors hover:text-textSecondary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
