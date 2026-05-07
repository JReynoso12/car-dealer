"use client";

import { HeroSection } from "@/components/hero-section";
import { InventoryCard } from "@/components/inventory-card";
import { LoaderOverlay } from "@/components/loader-overlay";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cars } from "@/lib/data/cars";

export default function Home() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <main className="overflow-x-clip bg-[#040406] text-white">
      <LoaderOverlay isMobile={isMobile} />
      <HeroSection showLoader />


      <section id="financing" className="mx-auto max-w-6xl px-6 py-20 md:px-10">
        <div className="glass rounded-3xl p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-300">Financing</p>
          <h2 className="heading-lg mt-3">Simple approvals, flexible terms</h2>
          <p className="mt-3 max-w-3xl text-zinc-300">
            Choose tailored down payment and financing terms with clear monthly estimates and no hidden fees.
          </p>
        </div>
      </section>

      <section id="inventory" className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Featured Inventory</p>
            <h3 className="heading-lg mt-3">Available Now</h3>
          </div>
          <a className="inline-flex min-h-11 items-center text-sm text-zinc-300 underline underline-offset-4" href="#">
            Schedule Test Drive
          </a>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cars.map((car, index) => (
            <InventoryCard key={car.slug} car={car} priority={index === 0} />
          ))}
        </div>
      </section>

      <TestimonialsCarousel />
    </main>
  );
}
