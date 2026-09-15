import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AntdProvider } from "@/components/providers/antd-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { GlobalSkeletonLoader } from "@/components/shared/global-skeleton-loader";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Flare — Your Glow, Your Way",
  description:
    "AI-powered skin & hair analysis, a DIY beauty marketplace, and a community forum — for everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans flex min-h-screen flex-col bg-background text-textPrimary antialiased transition-colors duration-300">
        <SessionProvider>
          <AntdProvider>
            <GlobalSkeletonLoader />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster richColors position="top-center" />
          </AntdProvider>
        </SessionProvider>
      </body>
    </html>
  );
}