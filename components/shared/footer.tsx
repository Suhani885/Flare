"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Linkedin, Youtube } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  
  if (pathname?.startsWith("/login") || pathname?.startsWith("/register")) {
    return null;
  }

  const socials = [
    { name: "Instagram", icon: <Instagram className="h-5 w-5" />, url: "https://instagram.com/flareher" },
    { name: "Facebook", icon: <Facebook className="h-5 w-5" />, url: "https://facebook.com/flareher" },
    { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, url: "https://linkedin.com/company/flareher" },
    { name: "YouTube", icon: <Youtube className="h-5 w-5" />, url: "https://youtube.com/flareher" },
  ];

  const footerLinks = {
    shop: ["Skincare", "Haircare", "Makeup", "Body Care", "New Arrivals", "Best Sellers"],
    company: ["About Us", "Our Mission", "Sustainability", "Careers", "Blog", "Contact Us"],
    help: ["FAQ", "Shipping & Delivery", "Returns & Exchanges", "Track Order", "Privacy Policy", "Terms of Service"],
  };

  return (
    <footer className="bg-white border-t border-border">
      <div className="container mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-6 flex items-center">
              <Image src="/logo.png" alt="FlareHer" width={110} height={36} className="object-contain" />
            </Link>
            <p className="text-sm text-textSecondary mb-8 leading-relaxed pr-4">
              Premium beauty products for everyone. AI-personalized, ethically sourced, cruelty-free, and made with intention.
            </p>

            <div>
              <h5 className="text-sm font-semibold text-textPrimary mb-4">
                Follow Us
              </h5>
              <div className="flex flex-wrap gap-3">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="h-10 w-10 rounded-full flex items-center justify-center bg-primary-600 text-white transition-all hover:-translate-y-1 hover:shadow-md hover:bg-primary-700"
                    aria-label={`Follow us on ${social.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-lg font-serif font-medium mb-6 capitalize text-textPrimary">
                {category}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${category === "shop" ? "products" : category}/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-textSecondary hover:text-primary-600 transition-colors hover:underline"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border/60 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-textMuted">
            © {new Date().getFullYear()} FlareHer Beauty. All rights reserved.
          </p>
          <div className="flex gap-4">
             <span className="text-xs text-textMuted">Beauty for every identity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}