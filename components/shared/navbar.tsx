"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { useSession, signOut } from "next-auth/react";
import {
  ChevronDown,
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  Heart,
  LogOut,
} from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  if (pathname?.startsWith("/login") || pathname?.startsWith("/register")) {
    return null;
  }

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery("");
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/marketplace", hasDropdown: true },
    { label: "AI Analysis", href: "/analysis" },
    { label: "Community", href: "/community" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-500 ease-out border-b ${
          scrolled
            ? "border-border/30 bg-white/70 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl"
            : "border-transparent bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center md:flex">
              <div className="flex items-center gap-2 rounded-full border border-border/40 bg-surface/30 px-2 py-1.5 shadow-sm backdrop-blur-md">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-1 rounded-full px-5 py-2 text-sm font-medium text-textSecondary transition-all hover:bg-white hover:text-primary-600 hover:shadow-sm"
                  >
                    {link.label}
                    {link.hasDropdown && (
                      <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSearchToggle}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/50 text-textSecondary transition-all hover:bg-white hover:text-primary-600 hover:shadow-sm"
              >
                {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </button>
              
              <Link
                href="/favorites"
                className="hidden h-10 w-10 items-center justify-center rounded-full bg-surface/50 text-textSecondary transition-all hover:bg-white hover:text-primary-600 hover:shadow-sm sm:flex"
              >
                <Heart className="h-5 w-5" />
              </Link>
              
              <Link
                href="/cart"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/50 text-textSecondary transition-all hover:bg-white hover:text-primary-600 hover:shadow-sm"
              >
                <div className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                    0
                  </span>
                </div>
              </Link>

              {status === "authenticated" ? (
                <div className="ml-2 hidden items-center gap-2 sm:flex">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-full bg-textPrimary px-6 py-2.5 text-sm font-medium text-white transition-all hover:scale-[1.02] hover:bg-black hover:shadow-xl"
                  >
                    <User className="h-4 w-4" />
                    <span>{session.user?.name?.split(" ")[0] ?? "Account"}</span>
                  </Link>
                  <button
                    onClick={() => signOut({ redirect: false }).then(() => router.push("/"))}
                    aria-label="Sign out"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/50 text-textSecondary transition-all hover:bg-white hover:text-primary-600 hover:shadow-sm"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="ml-2 hidden items-center gap-2 rounded-full bg-textPrimary px-6 py-2.5 text-sm font-medium text-white transition-all hover:scale-[1.02] hover:bg-black hover:shadow-xl sm:flex"
                >
                  <User className="h-4 w-4" />
                  <span>Account</span>
                </Link>
              )}

              <button
                className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-surface/50 text-textSecondary transition-all hover:bg-white md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <div
          className={`absolute left-0 top-full w-full overflow-hidden transition-all duration-300 ease-in-out ${
            isSearchOpen ? "h-24 border-b border-border/30 bg-white shadow-lg" : "h-0"
          }`}
        >
          <div className="container mx-auto flex h-full items-center px-6 md:px-12">
            <div className="relative w-full max-w-3xl mx-auto flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-textMuted" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products, concern, routine..."
                className="h-14 w-full rounded-full border border-border/60 bg-surface/50 pl-12 pr-4 text-lg text-textPrimary placeholder-textMuted outline-none transition-all focus:border-primary-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(219,45,110,0.1)]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                className="absolute right-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-700"
                onClick={handleSearchToggle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 md:hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col space-y-6 text-2xl font-serif">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="border-b border-border/30 pb-4 text-textPrimary transition-colors hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {status === "authenticated" ? (
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 rounded-xl bg-textPrimary py-4 px-6 text-lg tracking-wide text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut({ redirect: false }).then(() => router.push("/"));
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl border border-border py-4 px-6 text-lg tracking-wide text-textPrimary"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-textPrimary py-4 px-6 text-lg tracking-wide text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login to Account
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}