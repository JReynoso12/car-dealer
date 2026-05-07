"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks } from "@/lib/data/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="fixed inset-x-0 top-0 z-[80] bg-transparent"
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="min-h-11 min-w-11 content-center text-sm tracking-[0.35em] text-zinc-100">
          STREET-CAR
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => {
            const active = item.href.startsWith("/") && pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative min-h-11 min-w-11 content-center text-sm text-zinc-200 transition hover:text-white ${
                  active ? "text-white" : ""
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[2px] bg-white transition-all ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/#contact"
            className="inline-flex min-h-11 items-center rounded-full bg-grey-400 px-5 text-sm font-semibold text-black transition hover:bg-cyan-300"
          >
            Book Test Drive
          </Link>
        </div>

        <button
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/20 md:hidden"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <span className="sr-only">Open mobile menu</span>
          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
          </div>
        </button>
      </div>

      <div
        className={`fixed inset-0 z-[90] bg-black/60 transition md:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-[100] h-full w-72 border-l border-white/10 bg-[#080b12] p-6 transition md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm tracking-[0.3em]">MENU</p>
          <button
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/20"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            X
          </button>
        </div>
        <nav className="flex flex-col gap-3">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="inline-flex min-h-11 items-center rounded-lg px-3 text-zinc-200 transition hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full bg-grey-400 px-4 text-sm font-semibold text-black"
          >
            Book Test Drive
          </Link>
        </nav>
      </aside>
    </header>
  );
}
