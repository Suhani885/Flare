import type { Audience } from "@/lib/generated/prisma/enums";

export type SiteTheme = "neutral" | "feminine" | "masculine";

export const THEME_COOKIE_NAME = "flare-theme";

const VALID_THEMES: SiteTheme[] = ["neutral", "feminine", "masculine"];

export function isSiteTheme(value: string | undefined | null): value is SiteTheme {
  return !!value && VALID_THEMES.includes(value as SiteTheme);
}

/**
 * Signed-in preference wins when set. Otherwise, fall back to the
 * `flare-theme` cookie set by the navbar's theme toggle for logged-out
 * visitors. Defaults to "neutral" when neither is present.
 */
export function resolveTheme(
  audiencePreference?: Audience | null,
  cookieFallback?: string | null
): SiteTheme {
  if (audiencePreference === "WOMEN") return "feminine";
  if (audiencePreference === "MEN") return "masculine";
  if (isSiteTheme(cookieFallback)) return cookieFallback;
  return "neutral";
}
