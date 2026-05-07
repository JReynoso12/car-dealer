"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { inventoryCategories, quickLinks } from "@/lib/data/site";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[#0a0a0a] border-t border-white/10 text-zinc-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-sm tracking-[0.3em] text-white">CARWEB</p>
          <p className="mt-4 text-sm text-zinc-400">
            Premium cars, transparent deals, and a modern buying experience.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              {
                key: "instagram",
                svg: (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17" cy="7" r="1" fill="currentColor" />
                  </svg>
                ),
              },
              {
                key: "facebook",
                svg: (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M13.5 8H16V5h-2.5C10.8 5 9 6.8 9 9.5V12H7v3h2v4h3v-4h2.3l.7-3H12V9.5c0-.8.3-1.5 1.5-1.5Z" />
                  </svg>
                ),
              },
              {
                key: "youtube",
                svg: (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M21 8.5a3 3 0 0 0-2.1-2.1C17.2 6 12 6 12 6s-5.2 0-6.9.4A3 3 0 0 0 3 8.5 31.8 31.8 0 0 0 3 15.5a3 3 0 0 0 2.1 2.1c1.7.4 6.9.4 6.9.4s5.2 0 6.9-.4a3 3 0 0 0 2.1-2.1 31.8 31.8 0 0 0 0-7ZM10 15V9l5 3-5 3Z" />
                  </svg>
                ),
              },
              {
                key: "x",
                svg: (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M18.2 4H21l-6.3 7.3L22 20h-5.6l-4.4-5.4L7.4 20H4.6l6.8-7.8L2 4h5.7l4 5L18.2 4Z" />
                  </svg>
                ),
              },
            ].map((icon) => (
              <a
                key={icon.key}
                href="#"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/20 text-xs hover:bg-white/10"
              >
                {icon.svg}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white">Inventory</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {inventoryCategories.map((item) => (
              <li key={item}>
                <a href="#" className="inline-flex min-h-11 items-center hover:text-white">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white">Contact</h4>
          <p className="mt-4 text-sm">(+63) 912 345 6789</p>
          <p className="mt-1 text-sm">sales@carweb.example</p>
          <p className="mt-1 text-sm">BGC, Taguig City</p>

          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <label className="text-sm text-white">Newsletter</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="h-11 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm outline-none focus:border-cyan-300"
              />
              <button
                type="submit"
                className="min-h-11 rounded-lg bg-cyan-400 px-4 text-sm font-semibold text-black"
              >
                Subscribe
              </button>
            </div>
            {subscribed ? <p className="text-xs text-emerald-400">Thanks, you are subscribed.</p> : null}
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {year} STREET CAR Motors. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
            <span>Dealer License #DL-2026-1190</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
