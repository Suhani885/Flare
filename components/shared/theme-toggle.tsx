"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Palette, Check } from "lucide-react";
import { THEME_COOKIE_NAME, isSiteTheme, type SiteTheme } from "@/lib/theme";

const options: { label: string; audience: "WOMEN" | "MEN" | "UNISEX"; theme: SiteTheme }[] = [
  { label: "For Her", audience: "WOMEN", theme: "feminine" },
  { label: "For Him", audience: "MEN", theme: "masculine" },
  { label: "For Everyone", audience: "UNISEX", theme: "neutral" },
];

function readThemeCookie(): SiteTheme | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${THEME_COOKIE_NAME}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : null;
  return isSiteTheme(value) ? value : null;
}

function writeThemeCookie(theme: SiteTheme): void {
  document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=31536000; samesite=lax`;
}

export function ThemeToggle({
  variant = "dropdown",
  onChange,
}: {
  variant?: "dropdown" | "inline";
  onChange?: () => void;
}) {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cookieTheme, setCookieTheme] = useState<SiteTheme | null>(() => readThemeCookie());

  if (status === "loading") return null;

  const isAuthenticated = status === "authenticated";
  const current = isAuthenticated
    ? session?.user?.audiencePreference ?? null
    : options.find((opt) => opt.theme === cookieTheme)?.audience ?? null;

  const choose = async (option: (typeof options)[number]) => {
    setSaving(true);
    setOpen(false);
    onChange?.();

    if (isAuthenticated) {
      const response = await fetch("/api/user/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audiencePreference: option.audience }),
      });

      if (!response.ok) {
        toast.error("Could not update your theme preference");
        setSaving(false);
        return;
      }

      await update({ audiencePreference: option.audience });
    } else {
      writeThemeCookie(option.theme);
      setCookieTheme(option.theme);
    }

    router.refresh();
    setSaving(false);
  };

  if (variant === "inline") {
    return (
      <div>
        <p className="mb-2 text-sm font-medium text-textPrimary">Theme</p>
        <div className="flex gap-2">
          {options.map((opt) => (
            <button
              key={opt.label}
              type="button"
              disabled={saving}
              onClick={() => choose(opt)}
              className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                current === opt.audience
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border-border bg-surface text-textSecondary hover:border-primary-300 hover:text-textPrimary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change theme"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/50 text-textSecondary transition-all hover:bg-white hover:text-primary-600 hover:shadow-sm"
      >
        <Palette className="h-5 w-5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border border-border bg-white p-2 shadow-xl">
            <p className="px-3 pb-2 pt-1 text-xs font-medium uppercase tracking-wide text-textMuted">
              Theme
            </p>
            {options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => choose(opt)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-textPrimary transition-colors hover:bg-surface"
              >
                {opt.label}
                {current === opt.audience && <Check className="h-4 w-4 text-primary-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
