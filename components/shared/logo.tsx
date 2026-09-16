import { useId } from "react";

export function Logo({ className = "" }: { className?: string }) {
  const id = `flare-mark-${useId()}`;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-primary-400)" />
            <stop offset="55%" stopColor="var(--color-primary-600)" />
            <stop offset="100%" stopColor="var(--color-primary-800)" />
          </linearGradient>
        </defs>
        <path
          d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
          fill={`url(#${id})`}
        />
      </svg>
      <span className="font-serif text-2xl italic font-medium leading-none text-textPrimary">
        Flare
      </span>
    </span>
  );
}
