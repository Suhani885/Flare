import { Flame } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Flame className="h-6 w-6 shrink-0 text-primary-600" strokeWidth={2.25} />
      <span className="font-serif text-2xl italic font-medium leading-none text-textPrimary">
        Flare
      </span>
    </span>
  );
}
