"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AntdProvider } from "@/components/providers/antd-provider";
import type { SiteTheme } from "@/lib/theme";

interface ThemeContextValue {
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Lets any client component read the current theme and switch it instantly
 *  — no server round-trip needed for the visual change itself. */
export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within <ThemeProvider>");
  }
  return ctx;
}

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: SiteTheme;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<SiteTheme>(initialTheme);

  // The server already renders the correct data-theme on <html> for the
  // very first paint (no flash). This effect keeps it in sync for every
  // subsequent client-side change, which is what actually drives the smooth
  // CSS transition defined in globals.css.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <AntdProvider theme={theme}>{children}</AntdProvider>
    </ThemeContext.Provider>
  );
}
