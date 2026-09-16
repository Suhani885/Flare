"use client";

import { ConfigProvider } from "antd";
import type { SiteTheme } from "@/lib/theme";

const THEME_PRIMARY: Record<SiteTheme, { base: string; hover: string }> = {
  neutral: { base: "#a8511f", hover: "#c86a2e" },
  feminine: { base: "#db2d6e", hover: "#ed4e8c" },
  masculine: { base: "#26527a", hover: "#326894" },
};

export function AntdProvider({
  children,
  theme = "neutral",
}: {
  children: React.ReactNode;
  theme?: SiteTheme;
}) {
  const colors = THEME_PRIMARY[theme];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: colors.base,
          colorSuccess: "#4c9d4c",
          colorWarning: "#d97706",
          colorError: "#db2d6e",
          colorInfo: "#379aad",
          colorBgBase: "#ffffff",
          colorBorder: "#e7e5e4",
          colorText: "#292524",
          colorTextSecondary: "#57534e",
          borderRadius: 8,
          fontFamily: "var(--font-inter)",
        },
        components: {
          Button: {
            controlHeight: 40,
            borderRadius: 8,
            primaryColor: colors.base,
          },
          Input: {
            controlHeight: 40,
            borderRadius: 8,
          },
          Select: {
            controlHeight: 40,
            borderRadius: 8,
          },
          Card: {
            borderRadiusLG: 12,
          },
          Form: {
            labelColor: "#57534e",
          },
          Table: {
            borderRadius: 12,
          },
          Upload: {
            borderRadius: 8,
          },
          Modal: {
            borderRadiusLG: 12,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
