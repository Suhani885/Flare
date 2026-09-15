"use client";

import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="rounded-[3rem] p-8 md:p-16 shadow-xl text-center max-w-5xl mx-auto bg-gradient-to-r from-primary-50 to-secondary-50 relative overflow-hidden text-textPrimary">
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/40 blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-serif font-light mb-6">
              Join Our Beauty <span className="italic text-primary-600">Newsletter</span>
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto text-textSecondary font-light">
              Get personalized beauty tips, exclusive offers, and early access to
              new products.
            </p>

            <form
              className="flex flex-col sm:flex-row max-w-lg mx-auto shadow-sm rounded-3xl sm:rounded-full overflow-hidden bg-white p-1.5 focus-within:ring-2 focus-within:ring-primary-500/20"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-6 py-4 bg-transparent focus:outline-none text-textPrimary placeholder-textMuted w-full"
              />
              <button
                type="submit"
                className="px-8 py-4 rounded-2xl sm:rounded-full text-white font-medium transition-all bg-primary-600 hover:bg-primary-700 mt-2 sm:mt-0"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs mt-6 text-textMuted">
              By subscribing, you agree to our Privacy Policy and Terms of Service
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
